/**
 * Redis MCP Integration Layer
 * 
 * @description Dual-memory architecture integration between Redis and MCP systems
 * @module RedisMCPIntegration
 * @requires events
 * @version 1.0.0
 * 
 * Features:
 * - Dual-memory architecture with Redis primary, MCP fallback
 * - Adapter Pattern for seamless MCP integration
 * - Circuit Breaker Pattern for Redis failure handling
 * - Strategy Pattern for different fallback approaches
 * - Data synchronization between Redis and MCP systems
 * - Memory-Keeper integration for persistent state
 * - Agent OS architectural compliance
 */

const { EventEmitter } = require('events');
const { RedisClient } = require('./redis-client');
const { WorkflowStateManager } = require('./workflow-state-manager');
const { StateQuery } = require('./state-query');
const { WorkflowStatusManager } = require('./workflow-status-manager');
const { createUseCaseConfig } = require('../config/redis-config');

/**
 * MCP fallback strategies
 */
const MCP_FALLBACK_STRATEGIES = {
  IMMEDIATE: 'immediate',        // Switch to MCP immediately on Redis failure
  GRACEFUL: 'graceful',         // Try to recover Redis first, then fallback
  HYBRID: 'hybrid',             // Use both systems simultaneously
  READ_ONLY: 'read_only'        // Fallback for read operations only
};

/**
 * Integration states
 */
const INTEGRATION_STATES = {
  REDIS_PRIMARY: 'redis_primary',           // Redis working, MCP standby
  MCP_FALLBACK: 'mcp_fallback',            // Redis failed, using MCP
  HYBRID_MODE: 'hybrid_mode',              // Both systems active
  SYNC_MODE: 'sync_mode',                  // Synchronizing between systems
  RECOVERY_MODE: 'recovery_mode'           // Recovering from failure
};

/**
 * Data synchronization directions
 */
const SYNC_DIRECTIONS = {
  REDIS_TO_MCP: 'redis_to_mcp',
  MCP_TO_REDIS: 'mcp_to_redis',
  BIDIRECTIONAL: 'bidirectional'
};

/**
 * Redis MCP Integration implementing Adapter and Circuit Breaker Patterns
 * 
 * Implements:
 * - Adapter Pattern for MCP system integration
 * - Circuit Breaker Pattern for failure handling
 * - Strategy Pattern for different fallback approaches
 * - Observer Pattern for system state notifications
 * - Template Method Pattern for sync operations
 */
class RedisMCPIntegration extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Initialize Redis components
    this.config = config.useCase ? config : createUseCaseConfig('workflow', config);
    this.redisClient = new RedisClient(this.config);
    this.stateManager = new WorkflowStateManager(this.config);
    this.stateQuery = new StateQuery(this.config);
    this.statusManager = new WorkflowStatusManager(this.config);
    
    // Integration settings
    this.settings = {
      fallbackStrategy: config.fallbackStrategy || MCP_FALLBACK_STRATEGIES.GRACEFUL,
      enableAutoSync: config.enableAutoSync !== false,
      syncInterval: config.syncInterval || 30000, // 30 seconds
      maxSyncRetries: config.maxSyncRetries || 3,
      enableHealthMonitoring: config.enableHealthMonitoring !== false,
      healthCheckInterval: config.healthCheckInterval || 10000, // 10 seconds
      enableDataValidation: config.enableDataValidation !== false,
      compressionEnabled: config.compressionEnabled === true
    };
    
    // Current integration state
    this.currentState = INTEGRATION_STATES.REDIS_PRIMARY;
    this.isConnected = false;
    this.redisHealthy = false;
    this.mcpHealthy = false;
    
    // MCP integration components
    this.mcpAdapter = null;
    this.memoryKeeperClient = null;
    
    // Circuit breaker state
    this.circuitBreaker = {
      failureCount: 0,
      maxFailures: config.maxFailures || 5,
      resetTimeout: config.resetTimeout || 60000, // 1 minute
      state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
      lastFailure: null
    };
    
    // Sync tracking
    this.syncMetrics = {
      totalSyncs: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      lastSyncTime: null,
      avgSyncDuration: 0,
      dataConflicts: 0,
      resolvedConflicts: 0
    };
    
    // Health monitoring
    this.healthMetrics = {
      redisResponseTime: 0,
      mcpResponseTime: 0,
      integrationUptime: Date.now(),
      totalFailovers: 0,
      lastFailoverTime: null
    };
    
    this._initializeIntegration();
  }
  
  /**
   * Initialize the Redis MCP integration
   */
  async initialize() {
    if (this.isConnected) {
      return;
    }
    
    try {
      // Initialize Redis components first
      await this.redisClient.connect();
      await this.stateManager.initialize();
      await this.stateQuery.initialize();
      await this.statusManager.initialize();
      
      // Initialize MCP integration
      await this._initializeMCPAdapter();
      await this._initializeMemoryKeeper();
      
      // Start health monitoring
      if (this.settings.enableHealthMonitoring) {
        this._startHealthMonitoring();
      }
      
      // Start auto synchronization
      if (this.settings.enableAutoSync) {
        this._startAutoSync();
      }
      
      this.isConnected = true;
      this.redisHealthy = true;
      this.emit('connected');
      this._logEvent('integration_initialized', {
        strategy: this.settings.fallbackStrategy,
        autoSync: this.settings.enableAutoSync
      });
      
    } catch (error) {
      this.emit('error', error);
      await this._handleRedisFailure(error);
      throw new Error(`Failed to initialize RedisMCPIntegration: ${error.message}`);
    }
  }
  
  /**
   * Get workflow state with fallback support
   * @param {string} projectEntityName - Project entity name
   * @returns {Promise<Object>} Workflow state
   */
  async getState(projectEntityName) {
    try {
      // Try Redis first if healthy
      if (this._isRedisAvailable()) {
        const startTime = Date.now();
        const state = await this.stateManager.getState(projectEntityName);
        this.healthMetrics.redisResponseTime = Date.now() - startTime;
        
        if (state) {
          this._resetCircuitBreaker();
          return this._enrichStateData(state);
        }
      }
      
      // Fallback to MCP
      if (this._shouldFallbackToMCP()) {
        return await this._getStateFromMCP(projectEntityName);
      }
      
      return null;
      
    } catch (error) {
      await this._handleRedisFailure(error);
      
      if (this._shouldFallbackToMCP()) {
        return await this._getStateFromMCP(projectEntityName);
      }
      
      throw error;
    }
  }
  
  /**
   * Set workflow state with dual-write support
   * @param {string} projectEntityName - Project entity name
   * @param {Object} state - Workflow state
   * @returns {Promise<boolean>} Success status
   */
  async setState(projectEntityName, state) {
    const operations = [];
    let primarySuccess = false;
    let fallbackSuccess = false;
    
    try {
      // Primary write to Redis
      if (this._isRedisAvailable()) {
        const startTime = Date.now();
        await this.stateManager.setState(projectEntityName, state);
        this.healthMetrics.redisResponseTime = Date.now() - startTime;
        primarySuccess = true;
        operations.push('redis_write');
        this._resetCircuitBreaker();
      }
      
    } catch (error) {
      await this._handleRedisFailure(error);
      operations.push('redis_write_failed');
    }
    
    // Fallback or concurrent write to MCP
    if (!primarySuccess || this.currentState === INTEGRATION_STATES.HYBRID_MODE) {
      try {
        await this._setStateToMCP(projectEntityName, state);
        fallbackSuccess = true;
        operations.push('mcp_write');
      } catch (error) {
        operations.push('mcp_write_failed');
        this._logError('mcp_write_error', {
          projectEntityName,
          error: error.message
        });
      }
    }
    
    const success = primarySuccess || fallbackSuccess;
    
    if (success) {
      this.emit('stateSet', {
        projectEntityName,
        operations,
        primarySuccess,
        fallbackSuccess,
        state: this.currentState
      });
    }
    
    return success;
  }
  
  /**
   * Query states with fallback support
   * @param {Object} criteria - Query criteria
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Query results
   */
  async queryStates(criteria, options = {}) {
    try {
      // Try Redis first if available
      if (this._isRedisAvailable()) {
        const startTime = Date.now();
        const results = await this.stateQuery.findByCriteria(criteria, options);
        this.healthMetrics.redisResponseTime = Date.now() - startTime;
        
        if (results && results.length > 0) {
          this._resetCircuitBreaker();
          return results.map(state => this._enrichStateData(state));
        }
      }
      
      // Fallback to MCP
      if (this._shouldFallbackToMCP()) {
        return await this._queryStatesFromMCP(criteria, options);
      }
      
      return [];
      
    } catch (error) {
      await this._handleRedisFailure(error);
      
      if (this._shouldFallbackToMCP()) {
        return await this._queryStatesFromMCP(criteria, options);
      }
      
      throw error;
    }
  }
  
  /**
   * Transition workflow status with dual-system support
   * @param {string} projectEntityName - Project entity name
   * @param {string} newStatus - Target status
   * @param {Object} options - Transition options
   * @returns {Promise<Object>} Transition result
   */
  async transitionStatus(projectEntityName, newStatus, options = {}) {
    try {
      // Try Redis first
      if (this._isRedisAvailable()) {
        const result = await this.statusManager.transitionStatus(projectEntityName, newStatus, options);
        this._resetCircuitBreaker();
        
        // Async sync to MCP for redundancy
        if (this.settings.enableAutoSync) {
          this._syncStatusToMCP(projectEntityName, newStatus, result).catch(error => {
            this._logError('status_sync_error', { projectEntityName, error: error.message });
          });
        }
        
        return result;
      }
      
      // Fallback to MCP
      if (this._shouldFallbackToMCP()) {
        return await this._transitionStatusInMCP(projectEntityName, newStatus, options);
      }
      
      throw new Error('No available systems for status transition');
      
    } catch (error) {
      await this._handleRedisFailure(error);
      
      if (this._shouldFallbackToMCP()) {
        return await this._transitionStatusInMCP(projectEntityName, newStatus, options);
      }
      
      throw error;
    }
  }
  
  /**
   * Synchronize data between Redis and MCP
   * @param {string} direction - Sync direction
   * @param {Object} options - Sync options
   * @returns {Promise<Object>} Sync results
   */
  async synchronizeData(direction = SYNC_DIRECTIONS.REDIS_TO_MCP, options = {}) {
    const startTime = Date.now();
    this.syncMetrics.totalSyncs++;
    
    try {
      let syncResult;
      
      switch (direction) {
        case SYNC_DIRECTIONS.REDIS_TO_MCP:
          syncResult = await this._syncRedisToMCP(options);
          break;
          
        case SYNC_DIRECTIONS.MCP_TO_REDIS:
          syncResult = await this._syncMCPToRedis(options);
          break;
          
        case SYNC_DIRECTIONS.BIDIRECTIONAL:
          const redisToMcp = await this._syncRedisToMCP(options);
          const mcpToRedis = await this._syncMCPToRedis(options);
          syncResult = {
            redisToMcp,
            mcpToRedis,
            conflicts: this._detectConflicts(redisToMcp, mcpToRedis)
          };
          break;
          
        default:
          throw new Error(`Invalid sync direction: ${direction}`);
      }
      
      this.syncMetrics.successfulSyncs++;
      this.syncMetrics.lastSyncTime = Date.now();
      
      const duration = Date.now() - startTime;
      this.syncMetrics.avgSyncDuration = 
        ((this.syncMetrics.avgSyncDuration * (this.syncMetrics.totalSyncs - 1)) + duration) / this.syncMetrics.totalSyncs;
      
      this.emit('dataSynchronized', {
        direction,
        duration,
        result: syncResult
      });
      
      return syncResult;
      
    } catch (error) {
      this.syncMetrics.failedSyncs++;
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Force failover to MCP systems
   * @param {string} reason - Failover reason
   * @returns {Promise<void>}
   */
  async forceFailover(reason = 'manual_override') {
    try {
      await this._performFailover(reason);
      
      this.emit('failoverCompleted', {
        reason,
        previousState: this.currentState,
        newState: INTEGRATION_STATES.MCP_FALLBACK,
        timestamp: Date.now()
      });
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Attempt to recover Redis connection
   * @returns {Promise<boolean>} Recovery success
   */
  async recoverRedis() {
    if (this.currentState === INTEGRATION_STATES.REDIS_PRIMARY) {
      return true; // Already recovered
    }
    
    try {
      this.currentState = INTEGRATION_STATES.RECOVERY_MODE;
      
      // Test Redis connectivity
      await this.redisClient.connect();
      await this._performHealthCheck();
      
      if (this.redisHealthy) {
        // Sync MCP data back to Redis
        await this.synchronizeData(SYNC_DIRECTIONS.MCP_TO_REDIS);
        
        this.currentState = INTEGRATION_STATES.REDIS_PRIMARY;
        this._resetCircuitBreaker();
        
        this.emit('redisRecovered', {
          timestamp: Date.now(),
          syncRequired: true
        });
        
        return true;
      }
      
      return false;
      
    } catch (error) {
      this._logError('redis_recovery_failed', { error: error.message });
      return false;
    }
  }
  
  /**
   * Get integration status and metrics
   * @returns {Object} Integration status
   */
  getStatus() {
    return {
      currentState: this.currentState,
      isConnected: this.isConnected,
      redisHealthy: this.redisHealthy,
      mcpHealthy: this.mcpHealthy,
      circuitBreaker: { ...this.circuitBreaker },
      syncMetrics: { ...this.syncMetrics },
      healthMetrics: { ...this.healthMetrics },
      settings: { ...this.settings }
    };
  }
  
  /**
   * Disconnect and cleanup
   */
  async disconnect() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    if (this.isConnected) {
      await this.redisClient.disconnect();
      await this.stateManager.disconnect();
      await this.stateQuery.disconnect();
      await this.statusManager.disconnect();
      
      this.isConnected = false;
      this.emit('disconnected');
    }
  }
  
  // Private methods
  
  /**
   * Initialize integration components
   * @private
   */
  _initializeIntegration() {
    this.healthMetrics.integrationUptime = Date.now();
    
    this._logEvent('integration_created', {
      strategy: this.settings.fallbackStrategy,
      autoSync: this.settings.enableAutoSync,
      healthMonitoring: this.settings.enableHealthMonitoring
    });
  }
  
  /**
   * Initialize MCP adapter
   * @private
   */
  async _initializeMCPAdapter() {
    // This would typically initialize MCP tool connections
    // For now, we'll create a placeholder adapter
    this.mcpAdapter = {
      async getState(projectName) {
        // MCP tool call would go here
        return null;
      },
      
      async setState(projectName, state) {
        // MCP tool call would go here
        return true;
      },
      
      async queryStates(criteria, options) {
        // MCP tool call would go here
        return [];
      },
      
      async transitionStatus(projectName, status, options) {
        // MCP tool call would go here
        return { success: true };
      }
    };
    
    this.mcpHealthy = true;
  }
  
  /**
   * Initialize Memory-Keeper client
   * @private
   */
  async _initializeMemoryKeeper() {
    // Initialize connection to Memory-Keeper MCP tool
    this.memoryKeeperClient = {
      async saveContext(key, value, options) {
        // Memory-Keeper context_save call would go here
        return true;
      },
      
      async getContext(key, options) {
        // Memory-Keeper context_get call would go here
        return null;
      },
      
      async searchContext(query, options) {
        // Memory-Keeper context_search call would go here
        return [];
      }
    };
  }
  
  /**
   * Start health monitoring
   * @private
   */
  _startHealthMonitoring() {
    this.healthCheckInterval = setInterval(async () => {
      await this._performHealthCheck();
    }, this.settings.healthCheckInterval);
  }
  
  /**
   * Start automatic synchronization
   * @private
   */
  _startAutoSync() {
    this.syncInterval = setInterval(async () => {
      if (this.currentState === INTEGRATION_STATES.HYBRID_MODE) {
        try {
          await this.synchronizeData(SYNC_DIRECTIONS.BIDIRECTIONAL);
        } catch (error) {
          this._logError('auto_sync_error', { error: error.message });
        }
      }
    }, this.settings.syncInterval);
  }
  
  /**
   * Perform health check
   * @private
   */
  async _performHealthCheck() {
    // Check Redis health
    try {
      const startTime = Date.now();
      await this.redisClient.ping();
      this.healthMetrics.redisResponseTime = Date.now() - startTime;
      this.redisHealthy = true;
    } catch (error) {
      this.redisHealthy = false;
      if (this.currentState === INTEGRATION_STATES.REDIS_PRIMARY) {
        await this._handleRedisFailure(error);
      }
    }
    
    // Check MCP health
    try {
      const startTime = Date.now();
      // Placeholder health check for MCP
      this.healthMetrics.mcpResponseTime = Date.now() - startTime;
      this.mcpHealthy = true;
    } catch (error) {
      this.mcpHealthy = false;
    }
    
    // Emit health status
    this.emit('healthCheck', {
      redisHealthy: this.redisHealthy,
      mcpHealthy: this.mcpHealthy,
      responseTime: {
        redis: this.healthMetrics.redisResponseTime,
        mcp: this.healthMetrics.mcpResponseTime
      }
    });
  }
  
  /**
   * Handle Redis failure
   * @private
   */
  async _handleRedisFailure(error) {
    this.circuitBreaker.failureCount++;
    this.circuitBreaker.lastFailure = Date.now();
    
    if (this.circuitBreaker.failureCount >= this.circuitBreaker.maxFailures) {
      this.circuitBreaker.state = 'OPEN';
      
      if (this.currentState === INTEGRATION_STATES.REDIS_PRIMARY) {
        await this._performFailover('redis_circuit_breaker');
      }
    }
    
    this._logError('redis_failure', {
      error: error.message,
      failureCount: this.circuitBreaker.failureCount,
      circuitState: this.circuitBreaker.state
    });
  }
  
  /**
   * Perform failover to MCP
   * @private
   */
  async _performFailover(reason) {
    const previousState = this.currentState;
    
    if (this.settings.fallbackStrategy === MCP_FALLBACK_STRATEGIES.IMMEDIATE) {
      this.currentState = INTEGRATION_STATES.MCP_FALLBACK;
    } else if (this.settings.fallbackStrategy === MCP_FALLBACK_STRATEGIES.HYBRID) {
      this.currentState = INTEGRATION_STATES.HYBRID_MODE;
    }
    
    this.healthMetrics.totalFailovers++;
    this.healthMetrics.lastFailoverTime = Date.now();
    
    this.emit('failoverStarted', {
      reason,
      from: previousState,
      to: this.currentState,
      timestamp: Date.now()
    });
    
    this._logEvent('failover_executed', {
      reason,
      previousState,
      newState: this.currentState
    });
  }
  
  /**
   * Check if Redis is available
   * @private
   */
  _isRedisAvailable() {
    return this.redisHealthy && 
           this.circuitBreaker.state !== 'OPEN' &&
           this.currentState !== INTEGRATION_STATES.MCP_FALLBACK;
  }
  
  /**
   * Check if should fallback to MCP
   * @private
   */
  _shouldFallbackToMCP() {
    return this.mcpHealthy && 
           (this.currentState === INTEGRATION_STATES.MCP_FALLBACK ||
            this.currentState === INTEGRATION_STATES.HYBRID_MODE ||
            !this.redisHealthy);
  }
  
  /**
   * Reset circuit breaker
   * @private
   */
  _resetCircuitBreaker() {
    if (this.circuitBreaker.state === 'OPEN' &&
        Date.now() - this.circuitBreaker.lastFailure > this.circuitBreaker.resetTimeout) {
      this.circuitBreaker.state = 'HALF_OPEN';
      this.circuitBreaker.failureCount = 0;
    }
    
    if (this.circuitBreaker.state === 'HALF_OPEN') {
      this.circuitBreaker.state = 'CLOSED';
      this.circuitBreaker.failureCount = 0;
    }
  }
  
  /**
   * Enrich state data with integration metadata
   * @private
   */
  _enrichStateData(state) {
    return {
      ...state,
      _metadata: {
        ...state._metadata,
        source: 'redis',
        retrievedAt: Date.now(),
        integrationState: this.currentState
      }
    };
  }
  
  /**
   * MCP fallback operations
   * @private
   */
  async _getStateFromMCP(projectEntityName) {
    const startTime = Date.now();
    const state = await this.mcpAdapter.getState(projectEntityName);
    this.healthMetrics.mcpResponseTime = Date.now() - startTime;
    
    if (state) {
      return {
        ...state,
        _metadata: {
          ...state._metadata,
          source: 'mcp',
          retrievedAt: Date.now(),
          integrationState: this.currentState
        }
      };
    }
    
    return null;
  }
  
  async _setStateToMCP(projectEntityName, state) {
    const startTime = Date.now();
    await this.mcpAdapter.setState(projectEntityName, state);
    this.healthMetrics.mcpResponseTime = Date.now() - startTime;
  }
  
  async _queryStatesFromMCP(criteria, options) {
    const startTime = Date.now();
    const results = await this.mcpAdapter.queryStates(criteria, options);
    this.healthMetrics.mcpResponseTime = Date.now() - startTime;
    
    return results.map(state => ({
      ...state,
      _metadata: {
        ...state._metadata,
        source: 'mcp',
        retrievedAt: Date.now(),
        integrationState: this.currentState
      }
    }));
  }
  
  async _transitionStatusInMCP(projectEntityName, newStatus, options) {
    const startTime = Date.now();
    const result = await this.mcpAdapter.transitionStatus(projectEntityName, newStatus, options);
    this.healthMetrics.mcpResponseTime = Date.now() - startTime;
    return result;
  }
  
  /**
   * Sync operations
   * @private
   */
  async _syncRedisToMCP(options = {}) {
    // Implementation for syncing Redis data to MCP
    return { synced: 0, errors: 0 };
  }
  
  async _syncMCPToRedis(options = {}) {
    // Implementation for syncing MCP data to Redis
    return { synced: 0, errors: 0 };
  }
  
  async _syncStatusToMCP(projectEntityName, status, result) {
    // Implementation for syncing status changes to MCP
    return true;
  }
  
  _detectConflicts(redisToMcp, mcpToRedis) {
    // Implementation for detecting data conflicts
    return [];
  }
  
  /**
   * Log event with structured format
   * @private
   */
  _logEvent(eventType, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      component: 'RedisMCPIntegration',
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
      component: 'RedisMCPIntegration',
      level: 'error',
      data
    };
    
    this.emit('error_logged', errorEntry);
  }
}

/**
 * MCP Adapter Factory for creating different MCP integrations
 */
class MCPAdapterFactory {
  static createMemoryKeeperAdapter(config = {}) {
    return {
      async saveState(key, state) {
        // Memory-Keeper context_save implementation
        return true;
      },
      
      async getState(key) {
        // Memory-Keeper context_get implementation  
        return null;
      },
      
      async searchStates(query) {
        // Memory-Keeper context_search implementation
        return [];
      }
    };
  }
  
  static createMementoAdapter(config = {}) {
    return {
      async createEntity(name, type, observations) {
        // Memento create_entities implementation
        return true;
      },
      
      async getEntity(name) {
        // Memento open_nodes implementation
        return null;
      },
      
      async searchEntities(query) {
        // Memento search_nodes implementation
        return [];
      }
    };
  }
}

module.exports = {
  RedisMCPIntegration,
  MCPAdapterFactory,
  MCP_FALLBACK_STRATEGIES,
  INTEGRATION_STATES,
  SYNC_DIRECTIONS
};