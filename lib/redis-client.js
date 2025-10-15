/**
 * Redis Client Wrapper
 * 
 * @description Event-driven Redis client with Agent OS integration patterns
 * @module RedisClient
 * @requires redis
 * @requires events
 * @version 1.0.0
 * 
 * Features:
 * - Event-driven connection management
 * - Auto-reconnection with exponential backoff
 * - Error logging to Memory-Keeper
 * - Health monitoring and service detection
 * - Graceful fallback to MCP systems
 * - Connection lifecycle management
 * - Performance monitoring
 * - Circuit breaker for persistent failures
 */

const { EventEmitter } = require('events');
const { createRedisConfig, getConfigSummary } = require('../config/redis-config');

/**
 * Connection states for Redis client
 */
const CONNECTION_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting', 
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
  FALLBACK: 'fallback'
};

/**
 * Redis Client with Agent OS integration patterns
 * 
 * Implements:
 * - Module Pattern for encapsulation
 * - Event-Driven Pattern for connection management
 * - Circuit Breaker Pattern for failure handling
 * - Adapter Pattern for MCP fallback integration
 */
class RedisClient extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Initialize configuration
    this.config = typeof config === 'object' ? createRedisConfig(config) : createRedisConfig();
    this.connectionString = this._getConnectionString();
    
    // Connection state management
    this.state = CONNECTION_STATES.DISCONNECTED;
    this.client = null;
    this.isConnecting = false;
    
    // Reconnection and retry management
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectTimeout = null;
    this.currentRetryDelay = this.config.retryDelayOnFailover;
    
    // Health monitoring
    this.healthCheckInterval = null;
    this.pingInterval = null;
    this.lastPingTime = null;
    this.lastPingLatency = null;
    
    // Circuit breaker for persistent failures
    this.circuitBreakerState = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.failureThreshold = 5;
    this.circuitBreakerTimeout = null;
    
    // MCP fallback system integration
    this.fallbackSystem = null;
    this.fallbackActive = false;
    
    // Memory-Keeper integration for logging
    this.memoryKeeperInstance = null;
    
    // Performance monitoring
    this.metrics = {
      connectionAttempts: 0,
      connectionSuccesses: 0,
      connectionFailures: 0,
      commandsExecuted: 0,
      commandsSucceeded: 0,
      commandsFailed: 0,
      totalConnectedTime: 0,
      connectionStartTime: null
    };
    
    // Bind event handlers
    this._bindEventHandlers();
    
    // Initialize health monitoring if enabled
    if (this.config.pingInterval > 0) {
      this._initializeHealthMonitoring();
    }
    
    this._logEvent('client_initialized', { config: getConfigSummary(this.config) });
  }
  
  /**
   * Initialize Redis connection
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.state === CONNECTION_STATES.CONNECTED) {
      return;
    }
    
    if (this.isConnecting) {
      return new Promise((resolve, reject) => {
        this.once('ready', resolve);
        this.once('error', reject);
      });
    }
    
    this.isConnecting = true;
    this.state = CONNECTION_STATES.CONNECTING;
    this.metrics.connectionAttempts++;
    this.metrics.connectionStartTime = Date.now();
    
    try {
      // Import Redis client dynamically to handle missing dependency
      const redis = await this._loadRedisModule();
      
      // Create Redis client with configuration
      this.client = redis.createClient({
        url: this.connectionString,
        database: this.config.db,
        socket: {
          connectTimeout: this.config.connectTimeout,
          lazyConnect: this.config.lazyConnect,
          keepAlive: this.config.keepAlive,
          family: this.config.family
        },
        retry_strategy: this._createRetryStrategy(),
        enable_ready_check: this.config.enableReadyCheck,
        max_loading_timeout: this.config.maxLoadingTimeout
      });
      
      // Set up event handlers
      this._setupClientEventHandlers();
      
      // Connect to Redis
      await this.client.connect();
      
    } catch (error) {
      this.isConnecting = false;
      await this._handleConnectionError(error);
      throw error;
    }
  }
  
  /**
   * Disconnect from Redis server
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.state === CONNECTION_STATES.DISCONNECTED) {
      return;
    }
    
    this._clearIntervals();
    
    if (this.client) {
      try {
        await this.client.quit();
      } catch (error) {
        // Force disconnect if quit fails
        this.client.disconnect();
      }
    }
    
    this._updateConnectionState(CONNECTION_STATES.DISCONNECTED);
    this._updateMetrics('disconnect');
    this._logEvent('connection_closed', { graceful: true });
  }
  
  /**
   * Check Redis server health
   * @returns {Promise<Object>} Health status object
   */
  async checkHealth() {
    const startTime = Date.now();
    
    try {
      if (!this.client || this.state !== CONNECTION_STATES.CONNECTED) {
        return {
          isHealthy: false,
          status: this.state,
          error: 'Not connected to Redis',
          latency: null,
          timestamp: new Date().toISOString()
        };
      }
      
      const pingResult = await this.client.ping();
      const latency = Date.now() - startTime;
      
      this.lastPingTime = Date.now();
      this.lastPingLatency = latency;
      
      const isHealthy = pingResult === 'PONG' && latency < 1000;
      
      return {
        isHealthy,
        status: this.state,
        latency,
        response: pingResult,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        isHealthy: false,
        status: this.state,
        error: error.message,
        latency: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Execute Redis command with fallback support
   * @param {string} command - Redis command name
   * @param {...any} args - Command arguments
   * @returns {Promise<any>} Command result
   */
  async executeCommand(command, ...args) {
    this.metrics.commandsExecuted++;
    
    try {
      // Check circuit breaker state
      if (this.circuitBreakerState === 'OPEN') {
        if (this.fallbackActive && this.fallbackSystem) {
          return await this._executeFallbackCommand(command, ...args);
        }
        throw new Error('Circuit breaker is OPEN - Redis operations suspended');
      }
      
      // Ensure connection
      if (this.state !== CONNECTION_STATES.CONNECTED) {
        await this.connect();
      }
      
      // Execute command
      const result = await this.client[command](...args);
      this.metrics.commandsSucceeded++;
      
      // Reset circuit breaker on success
      if (this.circuitBreakerState === 'HALF_OPEN') {
        this._closeCircuitBreaker();
      }
      
      return result;
      
    } catch (error) {
      this.metrics.commandsFailed++;
      this._handleCommandError(error, command, args);
      
      // Try fallback if available
      if (this.fallbackActive && this.fallbackSystem) {
        try {
          return await this._executeFallbackCommand(command, ...args);
        } catch (fallbackError) {
          this._logError('fallback_command_failed', { 
            command, 
            args,
            redisError: error.message,
            fallbackError: fallbackError.message 
          });
        }
      }
      
      throw error;
    }
  }
  
  /**
   * Redis GET command
   */
  async get(key) {
    return this.executeCommand('get', key);
  }
  
  /**
   * Redis SET command
   */
  async set(key, value, options = {}) {
    const args = [key, value];
    if (options.EX) args.push('EX', options.EX);
    if (options.PX) args.push('PX', options.PX);
    if (options.NX) args.push('NX');
    if (options.XX) args.push('XX');
    
    return this.executeCommand('set', ...args);
  }
  
  /**
   * Redis DEL command
   */
  async del(...keys) {
    return this.executeCommand('del', ...keys);
  }
  
  /**
   * Redis EXISTS command
   */
  async exists(...keys) {
    return this.executeCommand('exists', ...keys);
  }
  
  /**
   * Redis HGET command
   */
  async hget(key, field) {
    return this.executeCommand('hGet', key, field);
  }
  
  /**
   * Redis HSET command
   */
  async hset(key, field, value) {
    return this.executeCommand('hSet', key, field, value);
  }
  
  /**
   * Redis HGETALL command
   */
  async hgetall(key) {
    return this.executeCommand('hGetAll', key);
  }
  
  /**
   * Redis EXPIRE command
   */
  async expire(key, seconds) {
    return this.executeCommand('expire', key, seconds);
  }
  
  /**
   * Redis PING command
   */
  async ping() {
    return this.executeCommand('ping');
  }
  
  /**
   * Set Memory-Keeper instance for logging
   * @param {Object} memoryKeeperInstance - Memory-Keeper MCP instance
   */
  setMemoryKeeperInstance(memoryKeeperInstance) {
    this.memoryKeeperInstance = memoryKeeperInstance;
    this._logEvent('memory_keeper_integrated', { hasInstance: !!memoryKeeperInstance });
  }
  
  /**
   * Set fallback system for when Redis is unavailable
   * @param {Object} fallbackSystem - Fallback system instance
   */
  setFallbackSystem(fallbackSystem) {
    this.fallbackSystem = fallbackSystem;
    this._logEvent('fallback_system_integrated', { hasSystem: !!fallbackSystem });
  }
  
  /**
   * Check if fallback system is currently active
   * @returns {boolean}
   */
  isFallbackActive() {
    return this.fallbackActive;
  }
  
  /**
   * Get current connection state
   * @returns {string}
   */
  getConnectionState() {
    return this.state;
  }
  
  /**
   * Get performance metrics
   * @returns {Object}
   */
  getMetrics() {
    const uptime = this.metrics.connectionStartTime ? 
      Date.now() - this.metrics.connectionStartTime : 0;
      
    return {
      ...this.metrics,
      uptime,
      successRate: this.metrics.commandsExecuted > 0 ? 
        (this.metrics.commandsSucceeded / this.metrics.commandsExecuted) * 100 : 0,
      averageLatency: this.lastPingLatency,
      circuitBreakerState: this.circuitBreakerState,
      fallbackActive: this.fallbackActive
    };
  }
  
  /**
   * Simulate failure for testing purposes
   */
  simulateFailure() {
    this._triggerCircuitBreaker();
    this._activateFallback();
  }
  
  // Private methods
  
  /**
   * Load Redis module with error handling
   * @private
   */
  async _loadRedisModule() {
    try {
      return require('redis');
    } catch (error) {
      const errorMsg = 'Redis module not found. Run: npm install redis';
      this._logError('redis_module_missing', { error: errorMsg });
      throw new Error(errorMsg);
    }
  }
  
  /**
   * Get properly formatted connection string
   * @private
   */
  _getConnectionString() {
    let connectionUrl = this.config.url;
    
    if (this.config.username || this.config.password) {
      const url = new URL(connectionUrl);
      if (this.config.username) url.username = this.config.username;
      if (this.config.password) url.password = this.config.password;
      connectionUrl = url.toString();
    }
    
    return connectionUrl;
  }
  
  /**
   * Create retry strategy for Redis client
   * @private
   */
  _createRetryStrategy() {
    return (retries) => {
      if (retries >= this.config.maxRetriesPerRequest) {
        this._triggerCircuitBreaker();
        return null;
      }
      
      const delay = Math.min(
        this.config.retryDelayOnFailover * Math.pow(2, retries),
        30000 // Max 30 second delay
      );
      
      this._logEvent('redis_retry_attempt', { retries, delay });
      return delay;
    };
  }
  
  /**
   * Bind event handlers to the instance
   * @private
   */
  _bindEventHandlers() {
    this.on('ready', () => {
      this.isConnecting = false;
      this._updateConnectionState(CONNECTION_STATES.CONNECTED);
      this._updateMetrics('connect');
      this._resetCircuitBreaker();
      this._deactivateFallback();
      this._startHealthMonitoring();
    });
    
    this.on('error', (error) => {
      this._handleConnectionError(error);
    });
    
    this.on('reconnecting', () => {
      this._updateConnectionState(CONNECTION_STATES.RECONNECTING);
      this.reconnectAttempts++;
    });
    
    this.on('end', () => {
      this._updateConnectionState(CONNECTION_STATES.DISCONNECTED);
      this._stopHealthMonitoring();
    });
  }
  
  /**
   * Setup Redis client event handlers
   * @private
   */
  _setupClientEventHandlers() {
    if (!this.client) return;
    
    this.client.on('ready', () => {
      this.emit('ready');
    });
    
    this.client.on('error', (error) => {
      this.emit('error', error);
    });
    
    this.client.on('reconnecting', () => {
      this.emit('reconnecting');
    });
    
    this.client.on('end', () => {
      this.emit('end');
    });
  }
  
  /**
   * Handle connection errors
   * @private
   */
  async _handleConnectionError(error) {
    this.isConnecting = false;
    this._updateConnectionState(CONNECTION_STATES.ERROR);
    this._updateMetrics('error');
    
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this._triggerCircuitBreaker();
    }
    
    this._logError('connection_error', { 
      error: error.message,
      failureCount: this.failureCount,
      circuitBreakerState: this.circuitBreakerState
    });
    
    // Activate fallback if available
    if (this.fallbackSystem && !this.fallbackActive) {
      this._activateFallback();
    }
  }
  
  /**
   * Handle command execution errors
   * @private
   */
  _handleCommandError(error, command, args) {
    this.failureCount++;
    
    if (this.failureCount >= this.failureThreshold) {
      this._triggerCircuitBreaker();
    }
    
    this._logError('command_error', { 
      error: error.message,
      command,
      args: JSON.stringify(args),
      failureCount: this.failureCount
    });
  }
  
  /**
   * Update connection state and emit events
   * @private
   */
  _updateConnectionState(newState) {
    const oldState = this.state;
    this.state = newState;
    
    if (oldState !== newState) {
      this.emit('stateChange', { from: oldState, to: newState });
      this._logEvent('state_change', { from: oldState, to: newState });
    }
  }
  
  /**
   * Update performance metrics
   * @private
   */
  _updateMetrics(eventType) {
    const now = Date.now();
    
    switch (eventType) {
      case 'connect':
        this.metrics.connectionSuccesses++;
        if (this.metrics.connectionStartTime) {
          this.metrics.totalConnectedTime += now - this.metrics.connectionStartTime;
        }
        break;
        
      case 'error':
        this.metrics.connectionFailures++;
        break;
        
      case 'disconnect':
        if (this.metrics.connectionStartTime) {
          this.metrics.totalConnectedTime += now - this.metrics.connectionStartTime;
          this.metrics.connectionStartTime = null;
        }
        break;
    }
  }
  
  /**
   * Initialize health monitoring
   * @private
   */
  _initializeHealthMonitoring() {
    // Don't start until connected
    if (this.state !== CONNECTION_STATES.CONNECTED) {
      return;
    }
    
    this._startHealthMonitoring();
  }
  
  /**
   * Start health monitoring intervals
   * @private
   */
  _startHealthMonitoring() {
    this._stopHealthMonitoring(); // Clear any existing intervals
    
    // Ping interval
    if (this.config.pingInterval > 0) {
      this.pingInterval = setInterval(async () => {
        try {
          await this.checkHealth();
        } catch (error) {
          this._logError('health_check_failed', { error: error.message });
        }
      }, this.config.pingInterval);
    }
  }
  
  /**
   * Stop health monitoring intervals
   * @private
   */
  _stopHealthMonitoring() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
  
  /**
   * Clear all intervals and timeouts
   * @private
   */
  _clearIntervals() {
    this._stopHealthMonitoring();
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.circuitBreakerTimeout) {
      clearTimeout(this.circuitBreakerTimeout);
      this.circuitBreakerTimeout = null;
    }
  }
  
  /**
   * Trigger circuit breaker to OPEN state
   * @private
   */
  _triggerCircuitBreaker() {
    if (this.circuitBreakerState === 'OPEN') return;
    
    this.circuitBreakerState = 'OPEN';
    this._logEvent('circuit_breaker_opened', { failureCount: this.failureCount });
    
    // Set timeout to try half-open state
    this.circuitBreakerTimeout = setTimeout(() => {
      this.circuitBreakerState = 'HALF_OPEN';
      this._logEvent('circuit_breaker_half_open', {});
    }, 60000); // 1 minute timeout
    
    // Activate fallback
    this._activateFallback();
  }
  
  /**
   * Close circuit breaker (reset to normal operation)
   * @private
   */
  _closeCircuitBreaker() {
    this.circuitBreakerState = 'CLOSED';
    this.failureCount = 0;
    
    if (this.circuitBreakerTimeout) {
      clearTimeout(this.circuitBreakerTimeout);
      this.circuitBreakerTimeout = null;
    }
    
    this._logEvent('circuit_breaker_closed', {});
  }
  
  /**
   * Reset circuit breaker state
   * @private
   */
  _resetCircuitBreaker() {
    this._closeCircuitBreaker();
  }
  
  /**
   * Activate fallback system
   * @private
   */
  _activateFallback() {
    if (this.fallbackActive || !this.fallbackSystem) return;
    
    this.fallbackActive = true;
    this.emit('fallbackActivated');
    this._logEvent('fallback_activated', {});
  }
  
  /**
   * Deactivate fallback system
   * @private
   */
  _deactivateFallback() {
    if (!this.fallbackActive) return;
    
    this.fallbackActive = false;
    this.emit('fallbackDeactivated');
    this._logEvent('fallback_deactivated', {});
  }
  
  /**
   * Execute command using fallback system
   * @private
   */
  async _executeFallbackCommand(command, ...args) {
    if (!this.fallbackSystem) {
      throw new Error('No fallback system available');
    }
    
    // Map Redis commands to fallback operations
    const fallbackMethod = this._mapCommandToFallback(command);
    
    if (!fallbackMethod || typeof this.fallbackSystem[fallbackMethod] !== 'function') {
      throw new Error(`Fallback method ${fallbackMethod} not available`);
    }
    
    return await this.fallbackSystem[fallbackMethod](...args);
  }
  
  /**
   * Map Redis command to fallback system method
   * @private
   */
  _mapCommandToFallback(command) {
    const commandMap = {
      'get': 'get',
      'set': 'set',
      'del': 'delete',
      'exists': 'exists',
      'hGet': 'hget',
      'hSet': 'hset',
      'hGetAll': 'hgetall',
      'expire': 'expire'
    };
    
    return commandMap[command];
  }
  
  /**
   * Log event to Memory-Keeper
   * @private
   */
  _logEvent(eventType, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      component: 'RedisClient',
      data
    };
    
    if (this.memoryKeeperInstance && typeof this.memoryKeeperInstance.logEvent === 'function') {
      this.memoryKeeperInstance.logEvent('redis_connection_events', logEntry);
    }
    
    // Emit for external listeners
    this.emit('log', logEntry);
  }
  
  /**
   * Log error to Memory-Keeper
   * @private
   */
  _logError(errorType, data) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      type: errorType,
      component: 'RedisClient',
      level: 'error',
      data
    };
    
    if (this.memoryKeeperInstance && typeof this.memoryKeeperInstance.logError === 'function') {
      this.memoryKeeperInstance.logError('redis_errors', errorEntry);
    }
    
    // Emit for external listeners
    this.emit('error_logged', errorEntry);
  }
}

module.exports = {
  RedisClient,
  CONNECTION_STATES
};