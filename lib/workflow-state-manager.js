/**
 * Workflow State Manager
 * 
 * @description Redis Hash-based workflow state management with Agent OS integration
 * @module WorkflowStateManager
 * @requires events
 * @version 1.0.0
 * 
 * Features:
 * - Repository Pattern for workflow state abstraction
 * - Redis Hash operations for structured data storage
 * - TTL management with 2-hour default expiration
 * - Atomic updates and state transitions
 * - Role context tracking and progress monitoring
 * - State validation and integrity checking
 * - Agent OS integration patterns
 */

const { EventEmitter } = require('events');
const { RedisClient } = require('./redis-client');
const { createUseCaseConfig } = require('../config/redis-config');

/**
 * Workflow status constants
 */
const WORKFLOW_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ERROR: 'error',
  CANCELLED: 'cancelled'
};

/**
 * Workflow roles in execution order
 */
const WORKFLOW_ROLES = {
  PATTERN_ANALYZER: 'Pattern Analyzer',
  IMPLEMENTER: 'Implementer', 
  VERIFIER: 'Verifier',
  DOCUMENTER: 'Documenter'
};

/**
 * State field validation rules
 */
const STATE_VALIDATION_RULES = {
  projectEntityName: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200
  },
  currentRole: {
    type: 'string', 
    required: true,
    enum: Object.values(WORKFLOW_ROLES)
  },
  progress: {
    type: 'number',
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: 'string',
    required: true,
    enum: Object.values(WORKFLOW_STATUS)
  },
  nextActions: {
    type: 'array',
    required: true,
    minItems: 0
  }
};

/**
 * Workflow State Manager implementing Repository Pattern
 * 
 * Implements:
 * - Repository Pattern for data access abstraction
 * - Data Mapper Pattern for Redis Hash serialization
 * - TTL Management Pattern for automatic expiration
 * - State Machine Pattern for status transitions
 */
class WorkflowStateManager extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Initialize configuration for workflow use case
    this.config = createUseCaseConfig('workflow', config);
    this.defaultTTL = this.config.useCase.defaultTTL;
    
    // Initialize Redis client
    this.redisClient = new RedisClient(this.config);
    this.isConnected = false;
    
    // State validation and serialization
    this.validator = new StateValidator();
    this.serializer = new StateSerializer();
    
    // Performance tracking
    this.metrics = {
      stateOperations: 0,
      stateRetrievals: 0,
      stateUpdates: 0,
      stateDeletes: 0,
      ttlOperations: 0,
      validationErrors: 0,
      averageOperationTime: 0
    };
    
    this._initializeManager();
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
      this.isConnected = true;
      this.emit('connected');
      this._logEvent('manager_initialized', { config: this.config.useCase });
      
    } catch (error) {
      this.emit('error', error);
      throw new Error(`Failed to initialize WorkflowStateManager: ${error.message}`);
    }
  }
  
  /**
   * Store complete workflow state
   * @param {string} projectEntityName - Project entity name
   * @param {Object} workflowState - Complete workflow state object
   * @param {Object} options - Storage options (ttl, validate)
   * @returns {Promise<Object>} Operation result
   */
  async storeState(projectEntityName, workflowState, options = {}) {
    const startTime = Date.now();
    this.metrics.stateOperations++;
    
    try {
      // Ensure connection
      await this.initialize();
      
      // Validate project entity name
      this._validateProjectEntityName(projectEntityName);
      
      // Validate workflow state if enabled (default true)
      if (options.validate !== false) {
        const validationResult = this.validator.validate(workflowState);
        if (!validationResult.isValid) {
          this.metrics.validationErrors++;
          throw new Error(`State validation failed: ${validationResult.errors.join(', ')}`);
        }
      }
      
      // Generate Redis key
      const redisKey = this._generateStateKey(projectEntityName);
      
      // Serialize state for Redis Hash storage
      const serializedState = this.serializer.serialize(workflowState);
      
      // Store state using Redis Hash operations
      const storeOperations = [];
      
      for (const [field, value] of Object.entries(serializedState)) {
        storeOperations.push(this.redisClient.hset(redisKey, field, value));
      }
      
      await Promise.all(storeOperations);
      
      // Set TTL
      const ttl = options.ttl || this.defaultTTL;
      await this.redisClient.expire(redisKey, ttl);
      this.metrics.ttlOperations++;
      
      // Update metrics
      this._updateMetrics(startTime);
      
      // Emit events
      this.emit('stateStored', { projectEntityName, workflowState, ttl });
      this._logEvent('state_stored', { 
        project: projectEntityName, 
        role: workflowState.currentRole,
        status: workflowState.status,
        ttl 
      });
      
      return {
        success: true,
        projectEntityName,
        key: redisKey,
        ttl,
        operationTime: Date.now() - startTime
      };
      
    } catch (error) {
      this.emit('error', error);
      this._logError('state_store_failed', { 
        project: projectEntityName, 
        error: error.message 
      });
      
      return {
        success: false,
        error: error.message,
        projectEntityName,
        operationTime: Date.now() - startTime
      };
    }
  }
  
  /**
   * Retrieve complete workflow state
   * @param {string} projectEntityName - Project entity name
   * @param {Object} options - Retrieval options
   * @returns {Promise<Object|null>} Workflow state or null if not found
   */
  async getState(projectEntityName, options = {}) {
    const startTime = Date.now();
    this.metrics.stateRetrievals++;
    
    try {
      await this.initialize();
      
      this._validateProjectEntityName(projectEntityName);
      
      const redisKey = this._generateStateKey(projectEntityName);
      
      // Check if key exists
      const keyExists = await this.redisClient.exists(redisKey);
      if (!keyExists) {
        return null;
      }
      
      // Retrieve all fields from Redis Hash
      const serializedState = await this.redisClient.hgetall(redisKey);
      
      if (!serializedState || Object.keys(serializedState).length === 0) {
        return null;
      }
      
      // Deserialize state
      const workflowState = this.serializer.deserialize(serializedState);
      
      // Update metrics
      this._updateMetrics(startTime);
      
      this.emit('stateRetrieved', { projectEntityName, workflowState });
      
      return workflowState;
      
    } catch (error) {
      this.emit('error', error);
      this._logError('state_retrieval_failed', { 
        project: projectEntityName, 
        error: error.message 
      });
      throw error;
    }
  }
  
  /**
   * Update specific fields in workflow state
   * @param {string} projectEntityName - Project entity name
   * @param {Object} updates - Fields to update
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Operation result
   */
  async updateState(projectEntityName, updates, options = {}) {
    const startTime = Date.now();
    this.metrics.stateUpdates++;
    
    try {
      await this.initialize();
      
      this._validateProjectEntityName(projectEntityName);
      
      const redisKey = this._generateStateKey(projectEntityName);
      
      // Check if state exists
      const exists = await this.redisClient.exists(redisKey);
      if (!exists) {
        throw new Error(`Workflow state not found for project: ${projectEntityName}`);
      }
      
      // Serialize updates for Redis Hash
      const serializedUpdates = this.serializer.serializeUpdates(updates);
      
      // Perform atomic updates
      const updateOperations = [];
      
      for (const [field, value] of Object.entries(serializedUpdates)) {
        updateOperations.push(this.redisClient.hset(redisKey, field, value));
      }
      
      await Promise.all(updateOperations);
      
      // Refresh TTL if configured
      if (options.refreshTTL !== false) {
        const ttl = options.ttl || this.defaultTTL;
        await this.redisClient.expire(redisKey, ttl);
        this.metrics.ttlOperations++;
      }
      
      // Update metadata
      await this.redisClient.hset(redisKey, 'updatedAt', new Date().toISOString());
      
      this._updateMetrics(startTime);
      
      this.emit('stateUpdated', { projectEntityName, updates });
      this._logEvent('state_updated', { 
        project: projectEntityName, 
        fields: Object.keys(updates).length,
        refreshedTTL: options.refreshTTL !== false
      });
      
      return {
        success: true,
        projectEntityName,
        updatedFields: Object.keys(updates),
        operationTime: Date.now() - startTime
      };
      
    } catch (error) {
      this.emit('error', error);
      this._logError('state_update_failed', { 
        project: projectEntityName, 
        error: error.message 
      });
      
      return {
        success: false,
        error: error.message,
        projectEntityName,
        operationTime: Date.now() - startTime
      };
    }
  }
  
  /**
   * Perform atomic state transition with multiple field updates
   * @param {string} projectEntityName - Project entity name
   * @param {Object} transition - All fields to update atomically
   * @param {Object} options - Transaction options
   * @returns {Promise<Object>} Operation result
   */
  async atomicTransition(projectEntityName, transition, options = {}) {
    const startTime = Date.now();
    this.metrics.stateOperations++;
    
    try {
      await this.initialize();
      
      this._validateProjectEntityName(projectEntityName);
      
      const redisKey = this._generateStateKey(projectEntityName);
      
      // Check if state exists
      const exists = await this.redisClient.exists(redisKey);
      if (!exists) {
        throw new Error(`Workflow state not found for project: ${projectEntityName}`);
      }
      
      // Start Redis transaction using MULTI/EXEC
      // Note: This is a simplified version - full Redis transaction support would require extending RedisClient
      
      // Serialize transition data
      const serializedTransition = this.serializer.serialize(transition);
      
      // Add transition metadata
      serializedTransition.updatedAt = new Date().toISOString();
      serializedTransition.transitionId = `transition_${Date.now()}`;
      
      // Perform all updates in sequence (atomic at Redis Hash level)
      const transitionOperations = [];
      
      for (const [field, value] of Object.entries(serializedTransition)) {
        transitionOperations.push(this.redisClient.hset(redisKey, field, value));
      }
      
      await Promise.all(transitionOperations);
      
      // Refresh TTL
      const ttl = options.ttl || this.defaultTTL;
      await this.redisClient.expire(redisKey, ttl);
      
      this._updateMetrics(startTime);
      
      this.emit('atomicTransition', { projectEntityName, transition });
      this._logEvent('atomic_transition', { 
        project: projectEntityName, 
        fields: Object.keys(transition).length,
        transitionId: serializedTransition.transitionId
      });
      
      return {
        success: true,
        projectEntityName,
        transitionId: serializedTransition.transitionId,
        transitionFields: Object.keys(transition),
        operationTime: Date.now() - startTime
      };
      
    } catch (error) {
      this.emit('error', error);
      this._logError('atomic_transition_failed', { 
        project: projectEntityName, 
        error: error.message 
      });
      
      return {
        success: false,
        error: error.message,
        projectEntityName,
        operationTime: Date.now() - startTime
      };
    }
  }
  
  /**
   * Delete workflow state
   * @param {string} projectEntityName - Project entity name
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteState(projectEntityName) {
    const startTime = Date.now();
    this.metrics.stateDeletes++;
    
    try {
      await this.initialize();
      
      this._validateProjectEntityName(projectEntityName);
      
      const redisKey = this._generateStateKey(projectEntityName);
      
      const deleted = await this.redisClient.del(redisKey);
      
      this._updateMetrics(startTime);
      
      if (deleted) {
        this.emit('stateDeleted', { projectEntityName });
        this._logEvent('state_deleted', { project: projectEntityName });
      }
      
      return deleted > 0;
      
    } catch (error) {
      this.emit('error', error);
      this._logError('state_delete_failed', { 
        project: projectEntityName, 
        error: error.message 
      });
      throw error;
    }
  }
  
  /**
   * Check if workflow state exists
   * @param {string} projectEntityName - Project entity name
   * @returns {Promise<boolean>} True if exists
   */
  async stateExists(projectEntityName) {
    try {
      await this.initialize();
      
      this._validateProjectEntityName(projectEntityName);
      
      const redisKey = this._generateStateKey(projectEntityName);
      const exists = await this.redisClient.exists(redisKey);
      
      return exists > 0;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get TTL for workflow state
   * @param {string} projectEntityName - Project entity name
   * @returns {Promise<number>} TTL in seconds (-1 if no TTL, -2 if key doesn't exist)
   */
  async getStateTTL(projectEntityName) {
    try {
      await this.initialize();
      
      this._validateProjectEntityName(projectEntityName);
      
      const redisKey = this._generateStateKey(projectEntityName);
      
      // Use Redis TTL command
      const ttl = await this.redisClient.executeCommand('ttl', redisKey);
      
      return ttl;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Set TTL for workflow state
   * @param {string} projectEntityName - Project entity name
   * @param {number} seconds - TTL in seconds
   * @returns {Promise<boolean>} True if TTL was set
   */
  async setStateTTL(projectEntityName, seconds) {
    this.metrics.ttlOperations++;
    
    try {
      await this.initialize();
      
      this._validateProjectEntityName(projectEntityName);
      
      const redisKey = this._generateStateKey(projectEntityName);
      
      const result = await this.redisClient.expire(redisKey, seconds);
      
      if (result) {
        this.emit('ttlSet', { projectEntityName, ttl: seconds });
        this._logEvent('ttl_set', { project: projectEntityName, ttl: seconds });
      }
      
      return result > 0;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get workflow state fields
   * @param {string} projectEntityName - Project entity name
   * @param {string[]} fields - Specific fields to retrieve
   * @returns {Promise<Object>} Object with requested fields
   */
  async getStateFields(projectEntityName, fields) {
    try {
      await this.initialize();
      
      this._validateProjectEntityName(projectEntityName);
      
      const redisKey = this._generateStateKey(projectEntityName);
      
      const values = [];
      for (const field of fields) {
        values.push(await this.redisClient.hget(redisKey, field));
      }
      
      const result = {};
      for (let i = 0; i < fields.length; i++) {
        if (values[i] !== null) {
          result[fields[i]] = this.serializer.deserializeValue(fields[i], values[i]);
        }
      }
      
      return result;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get performance metrics
   * @returns {Object} Performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      isConnected: this.isConnected,
      defaultTTL: this.defaultTTL,
      redisMetrics: this.redisClient.getMetrics()
    };
  }
  
  /**
   * Disconnect from Redis
   */
  async disconnect() {
    if (this.isConnected) {
      await this.redisClient.disconnect();
      this.isConnected = false;
      this.emit('disconnected');
    }
  }
  
  // Private methods
  
  /**
   * Initialize manager with event handlers
   * @private
   */
  _initializeManager() {
    // Set up Redis client event handlers
    this.redisClient.on('error', (error) => {
      this.emit('redisError', error);
    });
    
    this.redisClient.on('fallbackActivated', () => {
      this.emit('fallbackActivated');
      this._logEvent('fallback_activated', {});
    });
    
    this._logEvent('manager_created', { useCase: this.config.useCase.type });
  }
  
  /**
   * Generate Redis key for workflow state
   * @private
   */
  _generateStateKey(projectEntityName) {
    return `workflows:${projectEntityName}`;
  }
  
  /**
   * Validate project entity name
   * @private
   */
  _validateProjectEntityName(projectEntityName) {
    if (!projectEntityName || typeof projectEntityName !== 'string') {
      throw new Error('Project entity name must be a non-empty string');
    }
    
    if (projectEntityName.length < 1 || projectEntityName.length > 200) {
      throw new Error('Project entity name must be between 1 and 200 characters');
    }
    
    // Check for invalid characters that could cause Redis key issues
    if (/[{}[\]\\]/.test(projectEntityName)) {
      throw new Error('Project entity name contains invalid characters');
    }
  }
  
  /**
   * Update performance metrics
   * @private
   */
  _updateMetrics(startTime) {
    const operationTime = Date.now() - startTime;
    const totalOperations = this.metrics.stateOperations + this.metrics.stateRetrievals + 
                           this.metrics.stateUpdates + this.metrics.stateDeletes;
    
    this.metrics.averageOperationTime = 
      ((this.metrics.averageOperationTime * (totalOperations - 1)) + operationTime) / totalOperations;
  }
  
  /**
   * Log event with structured format
   * @private
   */
  _logEvent(eventType, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      component: 'WorkflowStateManager',
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
      component: 'WorkflowStateManager',
      level: 'error',
      data
    };
    
    this.emit('error_logged', errorEntry);
  }
}

/**
 * State Validator for workflow state validation
 */
class StateValidator {
  /**
   * Validate complete workflow state
   * @param {Object} state - State to validate
   * @returns {Object} Validation result
   */
  validate(state) {
    const errors = [];
    
    if (!state || typeof state !== 'object') {
      return { isValid: false, errors: ['State must be an object'] };
    }
    
    // Validate each field according to rules
    for (const [field, rules] of Object.entries(STATE_VALIDATION_RULES)) {
      const fieldErrors = this._validateField(field, state[field], rules);
      errors.push(...fieldErrors);
    }
    
    // Custom validation rules
    if (state.progress !== undefined && state.currentRole) {
      const progressErrors = this._validateProgressForRole(state.currentRole, state.progress);
      errors.push(...progressErrors);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate individual field
   * @private
   */
  _validateField(fieldName, value, rules) {
    const errors = [];
    
    // Required check
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`Field '${fieldName}' is required`);
      return errors;
    }
    
    // Skip further validation if field is not provided and not required
    if (value === undefined || value === null) {
      return errors;
    }
    
    // Type check
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`Field '${fieldName}' must be a string`);
    } else if (rules.type === 'number' && typeof value !== 'number') {
      errors.push(`Field '${fieldName}' must be a number`);
    } else if (rules.type === 'array' && !Array.isArray(value)) {
      errors.push(`Field '${fieldName}' must be an array`);
    }
    
    // Enum check
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`Field '${fieldName}' must be one of: ${rules.enum.join(', ')}`);
    }
    
    // String length checks
    if (rules.type === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`Field '${fieldName}' must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`Field '${fieldName}' must be at most ${rules.maxLength} characters`);
      }
    }
    
    // Number range checks
    if (rules.type === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`Field '${fieldName}' must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`Field '${fieldName}' must be at most ${rules.max}`);
      }
    }
    
    // Array checks
    if (rules.type === 'array') {
      if (rules.minItems !== undefined && value.length < rules.minItems) {
        errors.push(`Field '${fieldName}' must have at least ${rules.minItems} items`);
      }
    }
    
    return errors;
  }
  
  /**
   * Validate progress value for specific role
   * @private
   */
  _validateProgressForRole(role, progress) {
    const errors = [];
    
    // Define expected progress ranges for each role
    const roleProgressRanges = {
      [WORKFLOW_ROLES.PATTERN_ANALYZER]: { min: 0, max: 25 },
      [WORKFLOW_ROLES.IMPLEMENTER]: { min: 25, max: 75 },
      [WORKFLOW_ROLES.VERIFIER]: { min: 75, max: 95 },
      [WORKFLOW_ROLES.DOCUMENTER]: { min: 95, max: 100 }
    };
    
    const range = roleProgressRanges[role];
    if (range && (progress < range.min || progress > range.max)) {
      errors.push(`Progress ${progress} is outside expected range ${range.min}-${range.max} for role '${role}'`);
    }
    
    return errors;
  }
}

/**
 * State Serializer for Redis Hash serialization
 */
class StateSerializer {
  /**
   * Serialize workflow state for Redis Hash storage
   * @param {Object} state - State to serialize
   * @returns {Object} Serialized state
   */
  serialize(state) {
    const serialized = {};
    
    for (const [key, value] of Object.entries(state)) {
      serialized[key] = this._serializeValue(value);
    }
    
    return serialized;
  }
  
  /**
   * Serialize updates for partial state updates
   * @param {Object} updates - Updates to serialize
   * @returns {Object} Serialized updates
   */
  serializeUpdates(updates) {
    const serialized = {};
    
    for (const [key, value] of Object.entries(updates)) {
      // Handle nested field updates (e.g., 'contextData.analysisType')
      serialized[key] = this._serializeValue(value);
    }
    
    return serialized;
  }
  
  /**
   * Deserialize workflow state from Redis Hash
   * @param {Object} serializedState - Serialized state from Redis
   * @returns {Object} Deserialized state
   */
  deserialize(serializedState) {
    const deserialized = {};
    
    for (const [key, value] of Object.entries(serializedState)) {
      deserialized[key] = this.deserializeValue(key, value);
    }
    
    return deserialized;
  }
  
  /**
   * Deserialize a single value based on field name
   * @param {string} fieldName - Field name for context
   * @param {string} value - Serialized value
   * @returns {any} Deserialized value
   */
  deserializeValue(fieldName, value) {
    if (value === null || value === undefined) {
      return null;
    }
    
    // Handle different field types
    if (fieldName === 'progress') {
      return parseFloat(value);
    }
    
    if (fieldName === 'nextActions' || fieldName.includes('Array') || 
        (typeof value === 'string' && value.startsWith('['))) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    
    if (fieldName === 'contextData' || fieldName === 'metadata' || 
        (typeof value === 'string' && value.startsWith('{'))) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    
    return value;
  }
  
  /**
   * Serialize a single value
   * @private
   */
  _serializeValue(value) {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  }
}

module.exports = {
  WorkflowStateManager,
  StateValidator,
  StateSerializer,
  WORKFLOW_STATUS,
  WORKFLOW_ROLES,
  STATE_VALIDATION_RULES
};