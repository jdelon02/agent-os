/**
 * Role Management System
 * 
 * @description Dynamic role management with transitions, permissions, and automatic handoffs
 * @module RoleManager
 * @requires events
 * @version 1.0.0
 * 
 * Features:
 * - Dynamic role transitions based on workflow progress
 * - Permission validation and access control
 * - Progress tracking per role with automatic thresholds
 * - Role handoff notifications and coordination
 * - Integration with Workflow Orchestrator and Phase A infrastructure
 * - Role-based resource allocation and task assignment
 * - Audit trails and compliance logging
 */

const { EventEmitter } = require('events');
const { RedisMCPIntegration } = require('./redis-mcp-integration');
const { WorkflowStatusManager } = require('./workflow-status-manager');
const { WORKFLOW_ROLES, WORKFLOW_STATUS } = require('./workflow-state-manager');
const { createUseCaseConfig } = require('../config/redis-config');

/**
 * Role transition states
 */
const ROLE_TRANSITION_STATES = {
  ACTIVE: 'active',
  PENDING_HANDOFF: 'pending_handoff',
  HANDOFF_REQUESTED: 'handoff_requested',
  HANDOFF_APPROVED: 'handoff_approved',
  TRANSITIONING: 'transitioning',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

/**
 * Permission levels for different operations
 */
const PERMISSION_LEVELS = {
  NONE: 0,
  READ: 1,
  WRITE: 2,
  EXECUTE: 3,
  ADMIN: 4,
  OWNER: 5
};

/**
 * Role operation types
 */
const ROLE_OPERATIONS = {
  READ_STATE: 'read_state',
  WRITE_STATE: 'write_state',
  TRANSITION_STATUS: 'transition_status',
  ASSIGN_TASKS: 'assign_tasks',
  MODIFY_WORKFLOW: 'modify_workflow',
  CANCEL_WORKFLOW: 'cancel_workflow',
  VIEW_METRICS: 'view_metrics',
  MANAGE_ROLES: 'manage_roles'
};

/**
 * Automatic handoff triggers
 */
const HANDOFF_TRIGGERS = {
  PROGRESS_THRESHOLD: 'progress_threshold',
  TIME_LIMIT: 'time_limit',
  TASK_COMPLETION: 'task_completion',
  ERROR_THRESHOLD: 'error_threshold',
  RESOURCE_CONSTRAINT: 'resource_constraint',
  MANUAL_REQUEST: 'manual_request'
};

/**
 * Role capability matrix
 */
const ROLE_CAPABILITIES = {
  [WORKFLOW_ROLES.PLANNER]: {
    maxProgress: 25,
    permissions: {
      [ROLE_OPERATIONS.READ_STATE]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.WRITE_STATE]: PERMISSION_LEVELS.WRITE,
      [ROLE_OPERATIONS.TRANSITION_STATUS]: PERMISSION_LEVELS.EXECUTE,
      [ROLE_OPERATIONS.ASSIGN_TASKS]: PERMISSION_LEVELS.EXECUTE,
      [ROLE_OPERATIONS.MODIFY_WORKFLOW]: PERMISSION_LEVELS.WRITE,
      [ROLE_OPERATIONS.CANCEL_WORKFLOW]: PERMISSION_LEVELS.EXECUTE,
      [ROLE_OPERATIONS.VIEW_METRICS]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.MANAGE_ROLES]: PERMISSION_LEVELS.NONE
    },
    capabilities: ['task_planning', 'requirement_analysis', 'workflow_design'],
    nextRoles: [WORKFLOW_ROLES.IMPLEMENTER, WORKFLOW_ROLES.COORDINATOR],
    resourceQuota: { cpu: 20, memory: 1024, agent_slots: 2 }
  },
  
  [WORKFLOW_ROLES.IMPLEMENTER]: {
    maxProgress: 85,
    permissions: {
      [ROLE_OPERATIONS.READ_STATE]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.WRITE_STATE]: PERMISSION_LEVELS.WRITE,
      [ROLE_OPERATIONS.TRANSITION_STATUS]: PERMISSION_LEVELS.EXECUTE,
      [ROLE_OPERATIONS.ASSIGN_TASKS]: PERMISSION_LEVELS.WRITE,
      [ROLE_OPERATIONS.MODIFY_WORKFLOW]: PERMISSION_LEVELS.WRITE,
      [ROLE_OPERATIONS.CANCEL_WORKFLOW]: PERMISSION_LEVELS.NONE,
      [ROLE_OPERATIONS.VIEW_METRICS]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.MANAGE_ROLES]: PERMISSION_LEVELS.NONE
    },
    capabilities: ['task_execution', 'code_implementation', 'system_integration'],
    nextRoles: [WORKFLOW_ROLES.REVIEWER, WORKFLOW_ROLES.COORDINATOR],
    resourceQuota: { cpu: 60, memory: 4096, agent_slots: 5 }
  },
  
  [WORKFLOW_ROLES.REVIEWER]: {
    maxProgress: 100,
    permissions: {
      [ROLE_OPERATIONS.READ_STATE]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.WRITE_STATE]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.TRANSITION_STATUS]: PERMISSION_LEVELS.EXECUTE,
      [ROLE_OPERATIONS.ASSIGN_TASKS]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.MODIFY_WORKFLOW]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.CANCEL_WORKFLOW]: PERMISSION_LEVELS.EXECUTE,
      [ROLE_OPERATIONS.VIEW_METRICS]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.MANAGE_ROLES]: PERMISSION_LEVELS.NONE
    },
    capabilities: ['quality_assurance', 'testing', 'validation'],
    nextRoles: [],
    resourceQuota: { cpu: 15, memory: 1024, agent_slots: 2 }
  },
  
  [WORKFLOW_ROLES.COORDINATOR]: {
    maxProgress: 100,
    permissions: {
      [ROLE_OPERATIONS.READ_STATE]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.WRITE_STATE]: PERMISSION_LEVELS.WRITE,
      [ROLE_OPERATIONS.TRANSITION_STATUS]: PERMISSION_LEVELS.ADMIN,
      [ROLE_OPERATIONS.ASSIGN_TASKS]: PERMISSION_LEVELS.ADMIN,
      [ROLE_OPERATIONS.MODIFY_WORKFLOW]: PERMISSION_LEVELS.ADMIN,
      [ROLE_OPERATIONS.CANCEL_WORKFLOW]: PERMISSION_LEVELS.ADMIN,
      [ROLE_OPERATIONS.VIEW_METRICS]: PERMISSION_LEVELS.READ,
      [ROLE_OPERATIONS.MANAGE_ROLES]: PERMISSION_LEVELS.ADMIN
    },
    capabilities: ['workflow_management', 'resource_coordination', 'conflict_resolution'],
    nextRoles: [WORKFLOW_ROLES.PLANNER, WORKFLOW_ROLES.IMPLEMENTER, WORKFLOW_ROLES.REVIEWER],
    resourceQuota: { cpu: 40, memory: 2048, agent_slots: 10 }
  }
};

/**
 * Role Management System implementing Strategy and State Patterns
 * 
 * Implements:
 * - Strategy Pattern for different role behaviors
 * - State Pattern for role transition management
 * - Observer Pattern for role change notifications
 * - Template Method Pattern for handoff processes
 * - Command Pattern for role operations
 */
class RoleManager extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Initialize core components
    this.config = createUseCaseConfig('role_manager', config);
    this.mcpIntegration = new RedisMCPIntegration(this.config);
    this.statusManager = new WorkflowStatusManager(this.config);
    
    // Role management settings
    this.settings = {
      enableAutoHandoff: config.enableAutoHandoff !== false,
      handoffProgressThreshold: config.handoffProgressThreshold || 0.9, // 90% of role's max
      maxRoleTimeLimit: config.maxRoleTimeLimit || 3600000, // 1 hour
      enablePermissionValidation: config.enablePermissionValidation !== false,
      enableResourceQuotas: config.enableResourceQuotas !== false,
      auditTrailEnabled: config.auditTrailEnabled !== false,
      handoffApprovalRequired: config.handoffApprovalRequired === true
    };
    
    // Role state tracking
    this.activeRoleAssignments = new Map(); // workflowId -> role assignment
    this.pendingHandoffs = new Map(); // handoffId -> handoff request
    this.roleHistory = new Map(); // workflowId -> role history
    this.resourceAllocations = new Map(); // role -> allocated resources
    
    // Performance tracking
    this.metrics = {
      totalRoleAssignments: 0,
      totalHandoffs: 0,
      automaticHandoffs: 0,
      manualHandoffs: 0,
      successfulTransitions: 0,
      failedTransitions: 0,
      averageRoleDuration: {},
      resourceUtilization: {},
      permissionViolations: 0
    };
    
    // Initialize role capabilities
    for (const role of Object.values(WORKFLOW_ROLES)) {
      this.metrics.averageRoleDuration[role] = 0;
      this.resourceAllocations.set(role, { allocated: 0, available: ROLE_CAPABILITIES[role].resourceQuota });
    }
    
    this._initializeRoleManager();
  }
  
  /**
   * Initialize the role manager
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }
    
    try {
      await this.mcpIntegration.initialize();
      await this.statusManager.initialize();
      
      // Start role monitoring loop
      this._startRoleMonitoring();
      
      this.isInitialized = true;
      this.emit('roleManagerInitialized');
      this._logEvent('role_manager_initialized', {});
      
    } catch (error) {
      this.emit('error', error);
      throw new Error(`Failed to initialize RoleManager: ${error.message}`);
    }
  }
  
  /**
   * Assign a role to a workflow
   * @param {string} workflowId - Workflow ID
   * @param {string} role - Role to assign
   * @param {string} assignedTo - Agent/user assigned to role
   * @param {Object} options - Assignment options
   * @returns {Promise<Object>} Assignment result
   */
  async assignRole(workflowId, role, assignedTo, options = {}) {
    try {
      await this.initialize();
      
      // Validate role
      if (!Object.values(WORKFLOW_ROLES).includes(role)) {
        throw new Error(`Invalid role: ${role}`);
      }
      
      // Check for existing assignment
      const existingAssignment = this.activeRoleAssignments.get(workflowId);
      if (existingAssignment && existingAssignment.role === role && existingAssignment.assignedTo === assignedTo) {
        return existingAssignment; // Already assigned
      }
      
      // Get workflow state to validate assignment
      const workflowState = await this.mcpIntegration.getState(workflowId);
      if (!workflowState) {
        throw new Error(`Workflow not found: ${workflowId}`);
      }
      
      // Validate role transition if changing roles
      if (existingAssignment) {
        await this._validateRoleTransition(existingAssignment.role, role, workflowState);
      }
      
      // Allocate resources for the role
      const resourceAllocation = await this._allocateResources(role, options.resourceOverride);
      
      // Create role assignment
      const assignment = {
        id: this._generateAssignmentId(),
        workflowId,
        role,
        assignedTo,
        assignedAt: Date.now(),
        state: ROLE_TRANSITION_STATES.ACTIVE,
        progress: workflowState.progress || 0,
        resources: resourceAllocation,
        permissions: ROLE_CAPABILITIES[role].permissions,
        metadata: {
          previousRole: existingAssignment?.role || null,
          assignmentReason: options.reason || 'manual_assignment',
          expectedDuration: options.expectedDuration || null
        }
      };
      
      // Store assignment
      this.activeRoleAssignments.set(workflowId, assignment);
      
      // Update workflow state with new role
      await this._updateWorkflowRole(workflowId, assignment);
      
      // Record in role history
      await this._recordRoleHistory(workflowId, assignment);
      
      // Update metrics
      this.metrics.totalRoleAssignments++;
      
      // Emit events
      this.emit('roleAssigned', {
        workflowId,
        role,
        assignedTo,
        assignmentId: assignment.id
      });
      
      this._logEvent('role_assigned', {
        workflowId,
        role,
        assignedTo,
        assignmentId: assignment.id
      });
      
      return assignment;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Request a role handoff
   * @param {string} workflowId - Workflow ID
   * @param {string} targetRole - Target role for handoff
   * @param {string} requestedBy - Who is requesting the handoff
   * @param {Object} options - Handoff options
   * @returns {Promise<Object>} Handoff request result
   */
  async requestHandoff(workflowId, targetRole, requestedBy, options = {}) {
    try {
      await this.initialize();
      
      const currentAssignment = this.activeRoleAssignments.get(workflowId);
      if (!currentAssignment) {
        throw new Error(`No active role assignment for workflow: ${workflowId}`);
      }
      
      if (currentAssignment.role === targetRole) {
        throw new Error(`Already in target role: ${targetRole}`);
      }
      
      // Validate handoff eligibility
      const eligibility = await this._checkHandoffEligibility(currentAssignment, targetRole);
      if (!eligibility.eligible) {
        throw new Error(`Handoff not eligible: ${eligibility.reason}`);
      }
      
      // Create handoff request
      const handoffId = this._generateHandoffId();
      const handoffRequest = {
        id: handoffId,
        workflowId,
        currentRole: currentAssignment.role,
        targetRole,
        requestedBy,
        requestedAt: Date.now(),
        state: this.settings.handoffApprovalRequired ? 
          ROLE_TRANSITION_STATES.HANDOFF_REQUESTED : 
          ROLE_TRANSITION_STATES.HANDOFF_APPROVED,
        trigger: options.trigger || HANDOFF_TRIGGERS.MANUAL_REQUEST,
        reason: options.reason || 'Manual handoff request',
        metadata: {
          currentProgress: currentAssignment.progress,
          estimatedCompletion: options.estimatedCompletion || null
        }
      };
      
      // Store pending handoff
      this.pendingHandoffs.set(handoffId, handoffRequest);
      
      // Update current assignment state
      currentAssignment.state = ROLE_TRANSITION_STATES.PENDING_HANDOFF;
      
      // Auto-approve if configured
      if (!this.settings.handoffApprovalRequired) {
        await this._executeHandoff(handoffRequest);
      }
      
      this.emit('handoffRequested', {
        handoffId,
        workflowId,
        currentRole: currentAssignment.role,
        targetRole,
        requestedBy
      });
      
      this._logEvent('handoff_requested', {
        handoffId,
        workflowId,
        currentRole: currentAssignment.role,
        targetRole
      });
      
      return handoffRequest;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Approve a pending handoff
   * @param {string} handoffId - Handoff ID
   * @param {string} approvedBy - Who approved the handoff
   * @returns {Promise<boolean>} Approval success
   */
  async approveHandoff(handoffId, approvedBy) {
    try {
      const handoffRequest = this.pendingHandoffs.get(handoffId);
      if (!handoffRequest) {
        throw new Error(`Handoff request not found: ${handoffId}`);
      }
      
      if (handoffRequest.state !== ROLE_TRANSITION_STATES.HANDOFF_REQUESTED) {
        throw new Error(`Handoff not in requestable state: ${handoffRequest.state}`);
      }
      
      // Update handoff state
      handoffRequest.state = ROLE_TRANSITION_STATES.HANDOFF_APPROVED;
      handoffRequest.approvedBy = approvedBy;
      handoffRequest.approvedAt = Date.now();
      
      // Execute the handoff
      await this._executeHandoff(handoffRequest);
      
      this.emit('handoffApproved', {
        handoffId,
        workflowId: handoffRequest.workflowId,
        approvedBy
      });
      
      return true;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Check if an operation is permitted for a role
   * @param {string} workflowId - Workflow ID
   * @param {string} operation - Operation to check
   * @param {string} requestedBy - Who is requesting the operation
   * @returns {Promise<Object>} Permission check result
   */
  async checkPermission(workflowId, operation, requestedBy) {
    try {
      await this.initialize();
      
      if (!this.settings.enablePermissionValidation) {
        return { permitted: true, reason: 'Permission validation disabled' };
      }
      
      const assignment = this.activeRoleAssignments.get(workflowId);
      if (!assignment) {
        return { permitted: false, reason: 'No active role assignment' };
      }
      
      if (assignment.assignedTo !== requestedBy) {
        return { permitted: false, reason: 'Operation not permitted for this user' };
      }
      
      const requiredLevel = PERMISSION_LEVELS.READ; // Default requirement
      const userLevel = assignment.permissions[operation] || PERMISSION_LEVELS.NONE;
      
      const permitted = userLevel >= requiredLevel;
      
      if (!permitted) {
        this.metrics.permissionViolations++;
        this._logEvent('permission_violation', {
          workflowId,
          operation,
          requestedBy,
          requiredLevel,
          userLevel
        });
      }
      
      return {
        permitted,
        reason: permitted ? 'Permission granted' : 'Insufficient permissions',
        requiredLevel,
        userLevel
      };
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get role assignment for a workflow
   * @param {string} workflowId - Workflow ID
   * @returns {Promise<Object>} Role assignment
   */
  async getRoleAssignment(workflowId) {
    try {
      await this.initialize();
      
      const assignment = this.activeRoleAssignments.get(workflowId);
      if (!assignment) {
        throw new Error(`No role assignment found for workflow: ${workflowId}`);
      }
      
      // Calculate role progress metrics
      const workflowState = await this.mcpIntegration.getState(workflowId);
      const roleCapability = ROLE_CAPABILITIES[assignment.role];
      const roleDuration = Date.now() - assignment.assignedAt;
      
      return {
        ...assignment,
        currentProgress: workflowState?.progress || 0,
        roleProgressPercentage: roleCapability ? 
          Math.min((workflowState?.progress || 0) / roleCapability.maxProgress * 100, 100) : 0,
        roleDuration,
        isEligibleForHandoff: await this._isEligibleForHandoff(assignment),
        nextPossibleRoles: roleCapability?.nextRoles || [],
        capabilities: roleCapability?.capabilities || []
      };
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get role history for a workflow
   * @param {string} workflowId - Workflow ID
   * @returns {Promise<Array>} Role history
   */
  async getRoleHistory(workflowId) {
    try {
      await this.initialize();
      
      const historyKey = `role_history:${workflowId}`;
      const history = await this.mcpIntegration.getState(historyKey) || [];
      
      return history.sort((a, b) => b.assignedAt - a.assignedAt);
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get role manager metrics
   * @returns {Object} Role manager metrics
   */
  getMetrics() {
    const activeAssignments = Array.from(this.activeRoleAssignments.values());
    const roleDistribution = {};
    
    // Calculate current role distribution
    for (const role of Object.values(WORKFLOW_ROLES)) {
      roleDistribution[role] = activeAssignments.filter(a => a.role === role).length;
    }
    
    // Calculate resource utilization
    const resourceUtilization = {};
    for (const [role, allocation] of this.resourceAllocations) {
      const total = ROLE_CAPABILITIES[role].resourceQuota;
      resourceUtilization[role] = {
        cpu: (allocation.allocated / total.cpu) * 100,
        memory: (allocation.allocated / total.memory) * 100,
        agent_slots: (allocation.allocated / total.agent_slots) * 100
      };
    }
    
    return {
      ...this.metrics,
      activeAssignments: this.activeRoleAssignments.size,
      pendingHandoffs: this.pendingHandoffs.size,
      roleDistribution,
      resourceUtilization,
      isInitialized: this.isInitialized,
      settings: this.settings
    };
  }
  
  /**
   * Shutdown role manager gracefully
   */
  async shutdown() {
    if (!this.isInitialized) {
      return;
    }
    
    // Stop monitoring
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
    }
    
    // Persist all active assignments
    for (const [workflowId, assignment] of this.activeRoleAssignments) {
      try {
        await this._persistRoleAssignment(workflowId, assignment);
      } catch (error) {
        this._logError('shutdown_persist_error', { workflowId, error: error.message });
      }
    }
    
    // Disconnect components
    await this.mcpIntegration.disconnect();
    await this.statusManager.disconnect();
    
    this.isInitialized = false;
    this.emit('roleManagerShutdown');
    this._logEvent('role_manager_shutdown', {});
  }
  
  // Private methods
  
  /**
   * Initialize role manager
   * @private
   */
  _initializeRoleManager() {
    this.startTime = Date.now();
    
    this._logEvent('role_manager_created', {
      settings: this.settings,
      supportedRoles: Object.values(WORKFLOW_ROLES)
    });
  }
  
  /**
   * Start role monitoring loop
   * @private
   */
  _startRoleMonitoring() {
    this.monitoringTimer = setInterval(async () => {
      try {
        await this._checkAutoHandoffTriggers();
        await this._updateRoleProgress();
        await this._cleanupExpiredHandoffs();
      } catch (error) {
        this._logError('role_monitoring_error', { error: error.message });
      }
    }, 5000); // Check every 5 seconds
  }
  
  /**
   * Check for automatic handoff triggers
   * @private
   */
  async _checkAutoHandoffTriggers() {
    if (!this.settings.enableAutoHandoff) {
      return;
    }
    
    for (const [workflowId, assignment] of this.activeRoleAssignments) {
      try {
        const workflowState = await this.mcpIntegration.getState(workflowId);
        if (!workflowState) continue;
        
        const roleCapability = ROLE_CAPABILITIES[assignment.role];
        if (!roleCapability) continue;
        
        // Check progress threshold
        const progressRatio = workflowState.progress / roleCapability.maxProgress;
        if (progressRatio >= this.settings.handoffProgressThreshold) {
          await this._triggerAutoHandoff(assignment, workflowState, HANDOFF_TRIGGERS.PROGRESS_THRESHOLD);
        }
        
        // Check time limit
        const roleDuration = Date.now() - assignment.assignedAt;
        if (roleDuration >= this.settings.maxRoleTimeLimit) {
          await this._triggerAutoHandoff(assignment, workflowState, HANDOFF_TRIGGERS.TIME_LIMIT);
        }
        
      } catch (error) {
        this._logError('auto_handoff_check_error', { workflowId, error: error.message });
      }
    }
  }
  
  /**
   * Trigger automatic handoff
   * @private
   */
  async _triggerAutoHandoff(assignment, workflowState, trigger) {
    const roleCapability = ROLE_CAPABILITIES[assignment.role];
    const nextRoles = roleCapability.nextRoles;
    
    if (nextRoles.length === 0) {
      return; // No next roles available
    }
    
    // Select next role based on workflow state
    const nextRole = this._selectNextRole(assignment, workflowState, nextRoles);
    
    try {
      await this.requestHandoff(
        assignment.workflowId,
        nextRole,
        'system',
        {
          trigger,
          reason: `Automatic handoff triggered by ${trigger}`,
          estimatedCompletion: Date.now() + 1800000 // 30 minutes
        }
      );
      
      this.metrics.automaticHandoffs++;
      
    } catch (error) {
      this._logError('auto_handoff_trigger_error', {
        workflowId: assignment.workflowId,
        trigger,
        error: error.message
      });
    }
  }
  
  /**
   * Select next role for automatic handoff
   * @private
   */
  _selectNextRole(assignment, workflowState, nextRoles) {
    // Simple selection logic - can be enhanced with ML/AI
    const progress = workflowState.progress || 0;
    
    if (progress < 25 && nextRoles.includes(WORKFLOW_ROLES.IMPLEMENTER)) {
      return WORKFLOW_ROLES.IMPLEMENTER;
    } else if (progress >= 25 && progress < 85 && nextRoles.includes(WORKFLOW_ROLES.IMPLEMENTER)) {
      return WORKFLOW_ROLES.IMPLEMENTER;
    } else if (progress >= 85 && nextRoles.includes(WORKFLOW_ROLES.REVIEWER)) {
      return WORKFLOW_ROLES.REVIEWER;
    }
    
    return nextRoles[0]; // Default to first available
  }
  
  /**
   * Execute a handoff
   * @private
   */
  async _executeHandoff(handoffRequest) {
    try {
      handoffRequest.state = ROLE_TRANSITION_STATES.TRANSITIONING;
      
      const currentAssignment = this.activeRoleAssignments.get(handoffRequest.workflowId);
      
      // Create new assignment for target role
      const newAssignment = await this.assignRole(
        handoffRequest.workflowId,
        handoffRequest.targetRole,
        handoffRequest.requestedBy,
        {
          reason: 'role_handoff',
          handoffId: handoffRequest.id
        }
      );
      
      // Update handoff state
      handoffRequest.state = ROLE_TRANSITION_STATES.COMPLETED;
      handoffRequest.completedAt = Date.now();
      
      // Clean up
      this.pendingHandoffs.delete(handoffRequest.id);
      
      // Update metrics
      this.metrics.totalHandoffs++;
      this.metrics.successfulTransitions++;
      
      if (handoffRequest.trigger !== HANDOFF_TRIGGERS.MANUAL_REQUEST) {
        this.metrics.automaticHandoffs++;
      } else {
        this.metrics.manualHandoffs++;
      }
      
      this.emit('handoffCompleted', {
        handoffId: handoffRequest.id,
        workflowId: handoffRequest.workflowId,
        fromRole: handoffRequest.currentRole,
        toRole: handoffRequest.targetRole,
        duration: handoffRequest.completedAt - handoffRequest.requestedAt
      });
      
      this._logEvent('handoff_completed', {
        handoffId: handoffRequest.id,
        workflowId: handoffRequest.workflowId,
        fromRole: handoffRequest.currentRole,
        toRole: handoffRequest.targetRole
      });
      
    } catch (error) {
      handoffRequest.state = ROLE_TRANSITION_STATES.FAILED;
      handoffRequest.error = error.message;
      
      this.metrics.failedTransitions++;
      
      this._logError('handoff_execution_error', {
        handoffId: handoffRequest.id,
        error: error.message
      });
      
      throw error;
    }
  }
  
  /**
   * Validate role transition
   * @private
   */
  async _validateRoleTransition(currentRole, targetRole, workflowState) {
    const currentCapability = ROLE_CAPABILITIES[currentRole];
    if (!currentCapability.nextRoles.includes(targetRole)) {
      throw new Error(`Invalid role transition from ${currentRole} to ${targetRole}`);
    }
    
    // Additional validation logic can be added here
    return true;
  }
  
  /**
   * Allocate resources for role
   * @private
   */
  async _allocateResources(role, resourceOverride = {}) {
    if (!this.settings.enableResourceQuotas) {
      return {};
    }
    
    const roleCapability = ROLE_CAPABILITIES[role];
    const requestedResources = { ...roleCapability.resourceQuota, ...resourceOverride };
    
    // Simple allocation - can be enhanced with sophisticated resource management
    return {
      allocated: requestedResources,
      timestamp: Date.now()
    };
  }
  
  /**
   * Update workflow with new role
   * @private
   */
  async _updateWorkflowRole(workflowId, assignment) {
    const workflowState = await this.mcpIntegration.getState(workflowId);
    if (workflowState) {
      workflowState.currentRole = assignment.role;
      workflowState.metadata = {
        ...workflowState.metadata,
        lastRoleChange: assignment.assignedAt,
        roleAssignmentId: assignment.id
      };
      
      await this.mcpIntegration.setState(workflowId, workflowState);
    }
  }
  
  /**
   * Record role history
   * @private
   */
  async _recordRoleHistory(workflowId, assignment) {
    if (!this.settings.auditTrailEnabled) {
      return;
    }
    
    const historyKey = `role_history:${workflowId}`;
    const history = await this.mcpIntegration.getState(historyKey) || [];
    
    history.push({
      assignmentId: assignment.id,
      role: assignment.role,
      assignedTo: assignment.assignedTo,
      assignedAt: assignment.assignedAt,
      previousRole: assignment.metadata.previousRole,
      reason: assignment.metadata.assignmentReason
    });
    
    await this.mcpIntegration.setState(historyKey, history);
  }
  
  /**
   * Generate assignment ID
   * @private
   */
  _generateAssignmentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `role_assignment_${timestamp}_${random}`;
  }
  
  /**
   * Generate handoff ID
   * @private
   */
  _generateHandoffId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `handoff_${timestamp}_${random}`;
  }
  
  /**
   * Log event with structured format
   * @private
   */
  _logEvent(eventType, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      component: 'RoleManager',
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
      component: 'RoleManager',
      level: 'error',
      data
    };
    
    this.emit('error_logged', errorEntry);
  }
}

module.exports = {
  RoleManager,
  ROLE_TRANSITION_STATES,
  PERMISSION_LEVELS,
  ROLE_OPERATIONS,
  HANDOFF_TRIGGERS,
  ROLE_CAPABILITIES
};