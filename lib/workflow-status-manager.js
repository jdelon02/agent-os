/**
 * Workflow Status Management System
 * 
 * @description State Machine Pattern implementation for workflow status transitions
 * @module WorkflowStatusManager
 * @requires events
 * @version 1.0.0
 * 
 * Features:
 * - State Machine Pattern for valid status transitions
 * - Status transition validation with role-based rules
 * - Status history tracking and audit trails
 * - Activity monitoring and event logging
 * - Automatic status progression logic
 * - Integration with Redis-backed state storage
 * - Agent OS architectural compliance
 */

const { EventEmitter } = require('events');
const { RedisClient } = require('./redis-client');
const { WorkflowStateManager, WORKFLOW_STATUS, WORKFLOW_ROLES } = require('./workflow-state-manager');
const { createUseCaseConfig } = require('../config/redis-config');

/**
 * Valid status transitions matrix
 * Defines which status transitions are allowed from each current status
 */
const STATUS_TRANSITIONS = {
  [WORKFLOW_STATUS.PENDING]: [
    WORKFLOW_STATUS.ACTIVE,
    WORKFLOW_STATUS.CANCELLED
  ],
  [WORKFLOW_STATUS.ACTIVE]: [
    WORKFLOW_STATUS.PAUSED,
    WORKFLOW_STATUS.COMPLETED,
    WORKFLOW_STATUS.FAILED,
    WORKFLOW_STATUS.CANCELLED
  ],
  [WORKFLOW_STATUS.PAUSED]: [
    WORKFLOW_STATUS.ACTIVE,
    WORKFLOW_STATUS.CANCELLED,
    WORKFLOW_STATUS.FAILED
  ],
  [WORKFLOW_STATUS.COMPLETED]: [
    // Terminal state - no transitions allowed
  ],
  [WORKFLOW_STATUS.FAILED]: [
    WORKFLOW_STATUS.PENDING,  // Allow retry
    WORKFLOW_STATUS.CANCELLED
  ],
  [WORKFLOW_STATUS.CANCELLED]: [
    WORKFLOW_STATUS.PENDING   // Allow restart
  ]
};

/**
 * Role-based status transition permissions
 * Defines which roles can perform specific status transitions
 */
const ROLE_TRANSITION_PERMISSIONS = {
  [WORKFLOW_ROLES.PLANNER]: [
    `${WORKFLOW_STATUS.PENDING}->${WORKFLOW_STATUS.ACTIVE}`,
    `${WORKFLOW_STATUS.PENDING}->${WORKFLOW_STATUS.CANCELLED}`,
    `${WORKFLOW_STATUS.FAILED}->${WORKFLOW_STATUS.PENDING}`,
    `${WORKFLOW_STATUS.CANCELLED}->${WORKFLOW_STATUS.PENDING}`
  ],
  [WORKFLOW_ROLES.IMPLEMENTER]: [
    `${WORKFLOW_STATUS.ACTIVE}->${WORKFLOW_STATUS.PAUSED}`,
    `${WORKFLOW_STATUS.ACTIVE}->${WORKFLOW_STATUS.COMPLETED}`,
    `${WORKFLOW_STATUS.ACTIVE}->${WORKFLOW_STATUS.FAILED}`,
    `${WORKFLOW_STATUS.PAUSED}->${WORKFLOW_STATUS.ACTIVE}`,
    `${WORKFLOW_STATUS.PAUSED}->${WORKFLOW_STATUS.FAILED}`
  ],
  [WORKFLOW_ROLES.REVIEWER]: [
    `${WORKFLOW_STATUS.COMPLETED}->${WORKFLOW_STATUS.FAILED}`, // Reject completed work
    `${WORKFLOW_STATUS.ACTIVE}->${WORKFLOW_STATUS.CANCELLED}` // Emergency stop
  ],
  [WORKFLOW_ROLES.COORDINATOR]: [
    // Coordinators can perform any transition
    ...Object.values(WORKFLOW_STATUS).flatMap(from => 
      (STATUS_TRANSITIONS[from] || []).map(to => `${from}->${to}`)
    )
  ]
};

/**
 * Automatic status progression rules based on progress
 */
const AUTO_STATUS_RULES = {
  progressThresholds: {
    0: WORKFLOW_STATUS.PENDING,
    1: WORKFLOW_STATUS.ACTIVE,
    100: WORKFLOW_STATUS.COMPLETED
  },
  roleProgressRules: {
    [WORKFLOW_ROLES.PLANNER]: { min: 0, max: 25 },
    [WORKFLOW_ROLES.IMPLEMENTER]: { min: 25, max: 85 },
    [WORKFLOW_ROLES.REVIEWER]: { min: 85, max: 100 }
  }
};

/**
 * Status change reason categories
 */
const STATUS_CHANGE_REASONS = {
  USER_ACTION: 'user_action',
  SYSTEM_AUTO: 'system_auto',
  ROLE_TRANSITION: 'role_transition',
  ERROR_CONDITION: 'error_condition',
  TIMEOUT: 'timeout',
  EXTERNAL_EVENT: 'external_event'
};

/**
 * Workflow Status Manager implementing State Machine Pattern
 * 
 * Implements:
 * - State Machine Pattern for status transitions
 * - Command Pattern for status change operations
 * - Observer Pattern for status change notifications
 * - Strategy Pattern for different transition validation approaches
 */
class WorkflowStatusManager extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Initialize configuration
    this.config = createUseCaseConfig('workflow', config);
    this.redisClient = new RedisClient(this.config);
    this.stateManager = new WorkflowStateManager(this.config);
    this.isConnected = false;
    
    // Status management settings
    this.settings = {
      enableAutoProgression: config.enableAutoProgression !== false,
      enableStatusHistory: config.enableStatusHistory !== false,
      historyRetentionDays: config.historyRetentionDays || 30,
      enableActivityMonitoring: config.enableActivityMonitoring !== false,
      validateRolePermissions: config.validateRolePermissions !== false,
      allowEmergencyOverrides: config.allowEmergencyOverrides === true
    };
    
    // Status tracking metrics
    this.metrics = {
      totalTransitions: 0,
      transitionsByStatus: {},
      transitionsByRole: {},
      rejectedTransitions: 0,
      autoProgressions: 0,
      emergencyOverrides: 0,
      averageTransitionTime: 0
    };
    
    // Status history cache (Redis-backed)
    this.historyKeyPrefix = 'workflow_status_history';
    this.activityKeyPrefix = 'workflow_activity';
    
    this._initializeStatusManager();
  }
  
  /**
   * Initialize Redis connection and setup
   */
  async initialize() {
    if (this.isConnected) {
      return;
    }
    
    try {
      await this.redisClient.connect();
      await this.stateManager.initialize();
      this.isConnected = true;
      this.emit('connected');
      this._logEvent('status_manager_initialized', {});
      
    } catch (error) {
      this.emit('error', error);
      throw new Error(`Failed to initialize WorkflowStatusManager: ${error.message}`);
    }
  }
  
  /**
   * Transition workflow to a new status
   * @param {string} projectEntityName - Project entity name
   * @param {string} newStatus - Target status
   * @param {Object} options - Transition options
   * @returns {Promise<Object>} Transition result
   */
  async transitionStatus(projectEntityName, newStatus, options = {}) {
    const startTime = Date.now();
    
    try {
      await this.initialize();
      
      // Get current workflow state
      const currentState = await this.stateManager.getState(projectEntityName);
      if (!currentState) {
        throw new Error(`Workflow not found: ${projectEntityName}`);
      }
      
      const currentStatus = currentState.status;
      const currentRole = currentState.currentRole;
      
      // Validate the transition
      const validationResult = await this._validateTransition(
        currentStatus, 
        newStatus, 
        currentRole, 
        options
      );
      
      if (!validationResult.valid) {
        this.metrics.rejectedTransitions++;
        const error = new Error(`Invalid status transition: ${validationResult.reason}`);
        this.emit('transitionRejected', {
          projectEntityName,
          from: currentStatus,
          to: newStatus,
          reason: validationResult.reason,
          role: currentRole
        });
        throw error;
      }
      
      // Prepare transition data
      const transitionData = {
        projectEntityName,
        fromStatus: currentStatus,
        toStatus: newStatus,
        role: currentRole,
        reason: options.reason || STATUS_CHANGE_REASONS.USER_ACTION,
        metadata: options.metadata || {},
        timestamp: Date.now(),
        user: options.user || 'system'
      };
      
      // Execute the transition
      const transitionResult = await this._executeTransition(currentState, newStatus, transitionData);
      
      // Update metrics
      this._updateTransitionMetrics(transitionData, startTime);
      
      // Log the transition
      if (this.settings.enableStatusHistory) {
        await this._recordStatusHistory(transitionData);
      }
      
      if (this.settings.enableActivityMonitoring) {
        await this._recordActivity(transitionData);
      }
      
      // Emit events
      this.emit('statusTransitioned', transitionResult);
      this._logEvent('status_transitioned', transitionResult);
      
      // Check for auto-progression opportunities
      if (this.settings.enableAutoProgression) {
        setTimeout(() => {
          this._checkAutoProgression(projectEntityName).catch(error => {
            this._logError('auto_progression_error', { projectEntityName, error: error.message });
          });
        }, 1000); // Small delay to allow current transaction to complete
      }
      
      return transitionResult;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get valid status transitions for current state
   * @param {string} projectEntityName - Project entity name
   * @param {string} role - Current user role (optional)
   * @returns {Promise<Array>} Valid status transitions
   */
  async getValidTransitions(projectEntityName, role = null) {
    try {
      await this.initialize();
      
      const currentState = await this.stateManager.getState(projectEntityName);
      if (!currentState) {
        return [];
      }
      
      const currentStatus = currentState.status;
      const currentRole = role || currentState.currentRole;
      
      // Get all possible transitions for current status
      const possibleTransitions = STATUS_TRANSITIONS[currentStatus] || [];
      
      // Filter by role permissions if enabled
      if (this.settings.validateRolePermissions && role) {
        const allowedTransitions = ROLE_TRANSITION_PERMISSIONS[currentRole] || [];
        const allowedTargets = allowedTransitions
          .filter(transition => transition.startsWith(`${currentStatus}->`))
          .map(transition => transition.split('->')[1]);
          
        return possibleTransitions.filter(status => allowedTargets.includes(status));
      }
      
      return possibleTransitions;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get status history for a workflow
   * @param {string} projectEntityName - Project entity name
   * @param {Object} options - Query options (limit, since, until)
   * @returns {Promise<Array>} Status history entries
   */
  async getStatusHistory(projectEntityName, options = {}) {
    try {
      await this.initialize();
      
      if (!this.settings.enableStatusHistory) {
        return [];
      }
      
      const historyKey = `${this.historyKeyPrefix}:${projectEntityName}`;
      const limit = options.limit || 50;
      
      // Get history entries from Redis sorted set
      const entries = await this.redisClient.executeCommand(
        'zrevrange', 
        historyKey, 
        0, 
        limit - 1,
        'WITHSCORES'
      );
      
      const history = [];
      for (let i = 0; i < entries.length; i += 2) {
        const entryData = JSON.parse(entries[i]);
        const timestamp = parseInt(entries[i + 1]);
        
        // Filter by time range if specified
        if (options.since && timestamp < options.since) continue;
        if (options.until && timestamp > options.until) continue;
        
        history.push({
          ...entryData,
          timestamp
        });
      }
      
      return history;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get workflow activity log
   * @param {string} projectEntityName - Project entity name
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Activity entries
   */
  async getActivityLog(projectEntityName, options = {}) {
    try {
      await this.initialize();
      
      if (!this.settings.enableActivityMonitoring) {
        return [];
      }
      
      const activityKey = `${this.activityKeyPrefix}:${projectEntityName}`;
      const limit = options.limit || 100;
      
      // Get activity entries
      const entries = await this.redisClient.executeCommand(
        'zrevrange',
        activityKey,
        0,
        limit - 1,
        'WITHSCORES'
      );
      
      const activities = [];
      for (let i = 0; i < entries.length; i += 2) {
        const activityData = JSON.parse(entries[i]);
        const timestamp = parseInt(entries[i + 1]);
        
        activities.push({
          ...activityData,
          timestamp
        });
      }
      
      return activities;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Force status transition (emergency override)
   * @param {string} projectEntityName - Project entity name
   * @param {string} newStatus - Target status
   * @param {Object} options - Override options
   * @returns {Promise<Object>} Transition result
   */
  async forceTransition(projectEntityName, newStatus, options = {}) {
    if (!this.settings.allowEmergencyOverrides) {
      throw new Error('Emergency overrides are disabled');
    }
    
    try {
      const overrideOptions = {
        ...options,
        reason: STATUS_CHANGE_REASONS.EXTERNAL_EVENT,
        emergency: true,
        metadata: {
          ...options.metadata,
          overrideReason: options.overrideReason || 'Emergency override',
          originalValidation: false
        }
      };
      
      const result = await this.transitionStatus(projectEntityName, newStatus, overrideOptions);
      
      this.metrics.emergencyOverrides++;
      this.emit('emergencyOverride', {
        projectEntityName,
        newStatus,
        reason: overrideOptions.overrideReason
      });
      
      return result;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get status management statistics
   * @returns {Promise<Object>} Statistics and metrics
   */
  async getStatistics() {
    try {
      await this.initialize();
      
      // Get workflow counts by status
      const statusCounts = {};
      for (const status of Object.values(WORKFLOW_STATUS)) {
        statusCounts[status] = 0;
      }
      
      // Scan all workflow states to get current status distribution
      const keys = [];
      let cursor = 0;
      
      do {
        const scanResult = await this.redisClient.executeCommand(
          'scan', cursor, 'MATCH', 'workflows:*', 'COUNT', 100
        );
        cursor = parseInt(scanResult[0]);
        keys.push(...(scanResult[1] || []));
      } while (cursor !== 0);
      
      // Get current status for each workflow
      for (const key of keys) {
        try {
          const projectName = key.replace('workflows:', '');
          const state = await this.stateManager.getState(projectName);
          if (state && state.status) {
            statusCounts[state.status]++;
          }
        } catch (error) {
          // Continue processing other workflows
        }
      }
      
      return {
        currentDistribution: statusCounts,
        transitionMetrics: this.metrics,
        settings: this.settings,
        totalWorkflows: keys.length,
        isConnected: this.isConnected
      };
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Cleanup old status history and activity logs
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupHistory() {
    try {
      await this.initialize();
      
      const cutoffTime = Date.now() - (this.settings.historyRetentionDays * 24 * 60 * 60 * 1000);
      let cleanedHistoryEntries = 0;
      let cleanedActivityEntries = 0;
      
      // Get all history and activity keys
      const historyKeys = [];
      const activityKeys = [];
      let cursor = 0;
      
      do {
        const scanResult = await this.redisClient.executeCommand(
          'scan', cursor, 'MATCH', `${this.historyKeyPrefix}:*`, 'COUNT', 100
        );
        cursor = parseInt(scanResult[0]);
        historyKeys.push(...(scanResult[1] || []));
      } while (cursor !== 0);
      
      cursor = 0;
      do {
        const scanResult = await this.redisClient.executeCommand(
          'scan', cursor, 'MATCH', `${this.activityKeyPrefix}:*`, 'COUNT', 100
        );
        cursor = parseInt(scanResult[0]);
        activityKeys.push(...(scanResult[1] || []));
      } while (cursor !== 0);
      
      // Clean up history entries
      for (const key of historyKeys) {
        const removed = await this.redisClient.executeCommand(
          'zremrangebyscore', key, 0, cutoffTime
        );
        cleanedHistoryEntries += removed;
      }
      
      // Clean up activity entries
      for (const key of activityKeys) {
        const removed = await this.redisClient.executeCommand(
          'zremrangebyscore', key, 0, cutoffTime
        );
        cleanedActivityEntries += removed;
      }
      
      const result = {
        cleanedHistoryEntries,
        cleanedActivityEntries,
        cutoffTime: new Date(cutoffTime).toISOString()
      };
      
      this.emit('historyCleanup', result);
      return result;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Disconnect and cleanup
   */
  async disconnect() {
    if (this.isConnected) {
      await this.redisClient.disconnect();
      await this.stateManager.disconnect();
      this.isConnected = false;
      this.emit('disconnected');
    }
  }
  
  // Private methods
  
  /**
   * Initialize status manager
   * @private
   */
  _initializeStatusManager() {
    // Initialize metrics tracking
    for (const status of Object.values(WORKFLOW_STATUS)) {
      this.metrics.transitionsByStatus[status] = 0;
    }
    
    for (const role of Object.values(WORKFLOW_ROLES)) {
      this.metrics.transitionsByRole[role] = 0;
    }
    
    this._logEvent('status_manager_created', {
      settings: this.settings,
      transitionRules: Object.keys(STATUS_TRANSITIONS).length
    });
  }
  
  /**
   * Validate status transition
   * @private
   */
  async _validateTransition(currentStatus, newStatus, currentRole, options) {
    // Emergency override bypasses validation
    if (options.emergency && this.settings.allowEmergencyOverrides) {
      return { valid: true, reason: 'Emergency override' };
    }
    
    // Check if target status is valid
    if (!Object.values(WORKFLOW_STATUS).includes(newStatus)) {
      return { valid: false, reason: `Invalid status: ${newStatus}` };
    }
    
    // Check if transition is allowed from current status
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return { 
        valid: false, 
        reason: `Transition from ${currentStatus} to ${newStatus} not allowed` 
      };
    }
    
    // Check role permissions if enabled
    if (this.settings.validateRolePermissions) {
      const transitionKey = `${currentStatus}->${newStatus}`;
      const rolePermissions = ROLE_TRANSITION_PERMISSIONS[currentRole] || [];
      
      if (!rolePermissions.includes(transitionKey)) {
        return {
          valid: false,
          reason: `Role ${currentRole} not authorized for transition ${transitionKey}`
        };
      }
    }
    
    return { valid: true, reason: 'Valid transition' };
  }
  
  /**
   * Execute status transition
   * @private
   */
  async _executeTransition(currentState, newStatus, transitionData) {
    // Update the workflow state
    const updatedState = {
      ...currentState,
      status: newStatus,
      metadata: {
        ...currentState.metadata,
        lastStatusChange: transitionData.timestamp,
        statusChangeReason: transitionData.reason,
        statusChangeUser: transitionData.user
      }
    };
    
    // Save the updated state
    await this.stateManager.setState(
      transitionData.projectEntityName,
      updatedState
    );
    
    return {
      projectEntityName: transitionData.projectEntityName,
      previousStatus: transitionData.fromStatus,
      currentStatus: newStatus,
      transitionTime: transitionData.timestamp,
      role: transitionData.role,
      reason: transitionData.reason,
      success: true
    };
  }
  
  /**
   * Record status history
   * @private
   */
  async _recordStatusHistory(transitionData) {
    const historyKey = `${this.historyKeyPrefix}:${transitionData.projectEntityName}`;
    const historyEntry = {
      from: transitionData.fromStatus,
      to: transitionData.toStatus,
      role: transitionData.role,
      reason: transitionData.reason,
      user: transitionData.user,
      metadata: transitionData.metadata
    };
    
    // Store in Redis sorted set with timestamp as score
    await this.redisClient.executeCommand(
      'zadd',
      historyKey,
      transitionData.timestamp,
      JSON.stringify(historyEntry)
    );
    
    // Set expiration on the key
    const expireDays = this.settings.historyRetentionDays;
    await this.redisClient.executeCommand('expire', historyKey, expireDays * 24 * 60 * 60);
  }
  
  /**
   * Record activity
   * @private
   */
  async _recordActivity(transitionData) {
    const activityKey = `${this.activityKeyPrefix}:${transitionData.projectEntityName}`;
    const activityEntry = {
      type: 'status_transition',
      from: transitionData.fromStatus,
      to: transitionData.toStatus,
      role: transitionData.role,
      user: transitionData.user,
      reason: transitionData.reason
    };
    
    // Store in Redis sorted set
    await this.redisClient.executeCommand(
      'zadd',
      activityKey,
      transitionData.timestamp,
      JSON.stringify(activityEntry)
    );
    
    // Limit activity log size (keep last 1000 entries)
    await this.redisClient.executeCommand('zremrangebyrank', activityKey, 0, -1001);
    
    // Set expiration
    const expireDays = this.settings.historyRetentionDays;
    await this.redisClient.executeCommand('expire', activityKey, expireDays * 24 * 60 * 60);
  }
  
  /**
   * Check for auto-progression opportunities
   * @private
   */
  async _checkAutoProgression(projectEntityName) {
    try {
      const currentState = await this.stateManager.getState(projectEntityName);
      if (!currentState) {
        return;
      }
      
      const { status, progress, currentRole } = currentState;
      
      // Check progress-based auto-progression
      const roleRules = AUTO_STATUS_RULES.roleProgressRules[currentRole];
      if (roleRules && progress >= roleRules.max) {
        // Role has completed its work, check if status should auto-progress
        let targetStatus = null;
        
        if (currentRole === WORKFLOW_ROLES.PLANNER && status === WORKFLOW_STATUS.ACTIVE) {
          // Planning complete, ready for implementation
          targetStatus = WORKFLOW_STATUS.ACTIVE; // Stays active but role should change
        } else if (currentRole === WORKFLOW_ROLES.IMPLEMENTER && status === WORKFLOW_STATUS.ACTIVE) {
          // Implementation complete, ready for review
          targetStatus = WORKFLOW_STATUS.ACTIVE; // Stays active but role should change
        } else if (currentRole === WORKFLOW_ROLES.REVIEWER && status === WORKFLOW_STATUS.ACTIVE) {
          // Review complete
          targetStatus = WORKFLOW_STATUS.COMPLETED;
        }
        
        if (targetStatus && targetStatus !== status) {
          await this.transitionStatus(projectEntityName, targetStatus, {
            reason: STATUS_CHANGE_REASONS.SYSTEM_AUTO,
            metadata: {
              autoProgression: true,
              triggerProgress: progress,
              triggerRole: currentRole
            }
          });
          
          this.metrics.autoProgressions++;
        }
      }
      
    } catch (error) {
      this._logError('auto_progression_check_error', {
        projectEntityName,
        error: error.message
      });
    }
  }
  
  /**
   * Update transition metrics
   * @private
   */
  _updateTransitionMetrics(transitionData, startTime) {
    this.metrics.totalTransitions++;
    this.metrics.transitionsByStatus[transitionData.toStatus]++;
    this.metrics.transitionsByRole[transitionData.role]++;
    
    const transitionTime = Date.now() - startTime;
    const totalTransitions = this.metrics.totalTransitions;
    
    this.metrics.averageTransitionTime = 
      ((this.metrics.averageTransitionTime * (totalTransitions - 1)) + transitionTime) / totalTransitions;
  }
  
  /**
   * Log event with structured format
   * @private
   */
  _logEvent(eventType, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      component: 'WorkflowStatusManager',
      data
    };
    
    this.emit('log', logEntry);
  }
  
  /**
   * Log error with structured format
   * @private
   */
  _logError(errorType, data) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      type: errorType,
      component: 'WorkflowStatusManager',
      level: 'error',
      data
    };
    
    this.emit('error_logged', errorEntry);
  }
}

/**
 * Status Transition Command for implementing Command Pattern
 */
class StatusTransitionCommand {
  constructor(statusManager, projectEntityName, newStatus, options) {
    this.statusManager = statusManager;
    this.projectEntityName = projectEntityName;
    this.newStatus = newStatus;
    this.options = options;
    this.executed = false;
    this.previousState = null;
  }
  
  /**
   * Execute the status transition
   */
  async execute() {
    if (this.executed) {
      throw new Error('Command already executed');
    }
    
    // Store previous state for potential undo
    this.previousState = await this.statusManager.stateManager.getState(this.projectEntityName);
    
    const result = await this.statusManager.transitionStatus(
      this.projectEntityName,
      this.newStatus,
      this.options
    );
    
    this.executed = true;
    return result;
  }
  
  /**
   * Undo the status transition (if supported)
   */
  async undo() {
    if (!this.executed || !this.previousState) {
      throw new Error('Cannot undo: command not executed or no previous state');
    }
    
    // Restore previous status
    await this.statusManager.transitionStatus(
      this.projectEntityName,
      this.previousState.status,
      {
        reason: STATUS_CHANGE_REASONS.USER_ACTION,
        metadata: { undoOperation: true }
      }
    );
    
    this.executed = false;
  }
}

module.exports = {
  WorkflowStatusManager,
  StatusTransitionCommand,
  STATUS_TRANSITIONS,
  ROLE_TRANSITION_PERMISSIONS,
  AUTO_STATUS_RULES,
  STATUS_CHANGE_REASONS
};