/**
 * Redis Service Detector
 * 
 * @description Redis availability detection for graceful fallback to MCP systems
 * @module RedisDetector
 * @requires events
 * @version 1.0.0
 * 
 * Features:
 * - Service health checks and availability monitoring
 * - Fallback trigger activation
 * - MCP fallback procedure integration
 * - Ping tests and timeout detection
 * - Fallback state management
 * - Performance monitoring
 * - Proactive failure detection
 */

const { EventEmitter } = require('events');
const { createRedisConfig } = require('../config/redis-config');

/**
 * Service detection states
 */
const DETECTION_STATES = {
  UNKNOWN: 'unknown',
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  DEGRADED: 'degraded',
  CHECKING: 'checking'
};

/**
 * Health check statuses
 */
const HEALTH_STATUS = {
  HEALTHY: 'healthy',
  UNHEALTHY: 'unhealthy',
  DEGRADED: 'degraded',
  TIMEOUT: 'timeout',
  ERROR: 'error'
};

/**
 * Redis Service Detector with Agent OS integration
 * 
 * Implements:
 * - Observer Pattern for service state monitoring
 * - Strategy Pattern for different detection methods
 * - Circuit Breaker Pattern for service protection
 */
class RedisDetector extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Initialize configuration
    this.config = createRedisConfig(config);
    this.connectionString = this._getConnectionString();
    
    // Service detection state
    this.state = DETECTION_STATES.UNKNOWN;
    this.lastHealthStatus = null;
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
    
    // Health monitoring configuration
    this.healthCheckInterval = this.config.healthCheckInterval || 60000; // 1 minute
    this.healthCheckTimeout = this.config.connectTimeout || 5000; // 5 seconds
    this.degradationThreshold = 3; // Consecutive failures before degraded
    this.failureThreshold = 5; // Consecutive failures before unavailable
    this.recoveryThreshold = 3; // Consecutive successes for recovery
    
    // Monitoring intervals
    this.healthCheckTimer = null;
    this.isMonitoring = false;
    
    // Fallback system integration
    this.fallbackTriggers = [];
    this.mcpIntegration = null;
    
    // Performance tracking
    this.metrics = {
      totalChecks: 0,
      successfulChecks: 0,
      failedChecks: 0,
      timeoutChecks: 0,
      averageResponseTime: 0,
      lastCheckTime: null,
      uptime: 0,
      downtimeStart: null,
      totalDowntime: 0
    };
    
    // Service simulation for testing
    this.simulatedState = null;
    this.simulationActive = false;
    
    this._initializeDetection();
  }
  
  /**
   * Start continuous service monitoring
   * @returns {Promise<void>}
   */
  async startMonitoring() {
    if (this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = true;
    this.emit('monitoringStarted');
    
    // Perform initial health check
    await this.checkHealth();
    
    // Start continuous monitoring
    this.healthCheckTimer = setInterval(async () => {
      try {
        await this.checkHealth();
      } catch (error) {
        this._logError('monitoring_error', { error: error.message });
      }
    }, this.healthCheckInterval);
    
    this._logEvent('monitoring_started', { interval: this.healthCheckInterval });
  }
  
  /**
   * Stop continuous service monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = false;
    
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
    
    this.emit('monitoringStopped');
    this._logEvent('monitoring_stopped', {});
  }
  
  /**
   * Perform comprehensive Redis health check
   * @returns {Promise<Object>} Detailed health status
   */
  async checkHealth() {
    // Handle simulation mode
    if (this.simulationActive && this.simulatedState) {
      return this._getSimulatedHealthStatus();
    }
    
    this.metrics.totalChecks++;
    const startTime = Date.now();
    
    try {
      const healthResult = await this._performHealthCheck();
      const responseTime = Date.now() - startTime;
      
      // Update metrics
      this._updateMetrics(true, responseTime);
      
      // Determine health status
      const healthStatus = this._determineHealthStatus(healthResult, responseTime);
      
      // Update service state based on health
      this._updateServiceState(healthStatus);
      
      // Update last health status
      this.lastHealthStatus = {
        ...healthStatus,
        timestamp: new Date().toISOString(),
        responseTime
      };
      
      this.emit('healthChecked', this.lastHealthStatus);
      return this.lastHealthStatus;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this._updateMetrics(false, responseTime);
      
      const errorStatus = {
        status: HEALTH_STATUS.ERROR,
        isHealthy: false,
        error: error.message,
        responseTime,
        timestamp: new Date().toISOString(),
        serviceState: this.state
      };
      
      this._updateServiceState(errorStatus);
      this.lastHealthStatus = errorStatus;
      
      this.emit('healthChecked', errorStatus);
      this._logError('health_check_error', { error: error.message, responseTime });
      
      return errorStatus;
    }
  }
  
  /**
   * Get current service availability state
   * @returns {string} Current detection state
   */
  getServiceState() {
    return this.state;
  }
  
  /**
   * Check if Redis service is currently available
   * @returns {boolean} True if service is available
   */
  isServiceAvailable() {
    return this.state === DETECTION_STATES.AVAILABLE;
  }
  
  /**
   * Check if service is degraded but still functional
   * @returns {boolean} True if service is degraded
   */
  isServiceDegraded() {
    return this.state === DETECTION_STATES.DEGRADED;
  }
  
  /**
   * Check if service is unavailable
   * @returns {boolean} True if service is unavailable
   */
  isServiceUnavailable() {
    return this.state === DETECTION_STATES.UNAVAILABLE;
  }
  
  /**
   * Get last health check result
   * @returns {Object|null} Last health status or null
   */
  getLastHealthStatus() {
    return this.lastHealthStatus;
  }
  
  /**
   * Get service detection metrics
   * @returns {Object} Performance and availability metrics
   */
  getMetrics() {
    const now = Date.now();
    const uptimeMs = this.metrics.lastCheckTime ? 
      (this.metrics.lastCheckTime - (this.metrics.downtimeStart || now)) : 0;
    
    return {
      ...this.metrics,
      uptimeSeconds: Math.floor(uptimeMs / 1000),
      availabilityPercentage: this.metrics.totalChecks > 0 ? 
        (this.metrics.successfulChecks / this.metrics.totalChecks) * 100 : 0,
      consecutiveFailures: this.consecutiveFailures,
      consecutiveSuccesses: this.consecutiveSuccesses,
      currentState: this.state,
      isMonitoring: this.isMonitoring
    };
  }
  
  /**
   * Register fallback trigger callback
   * @param {Function} callback - Callback to execute when fallback is triggered
   */
  onFallbackTrigger(callback) {
    if (typeof callback === 'function') {
      this.fallbackTriggers.push(callback);
    }
  }
  
  /**
   * Set MCP integration for fallback procedures
   * @param {Object} mcpIntegration - MCP integration instance
   */
  setMCPIntegration(mcpIntegration) {
    this.mcpIntegration = mcpIntegration;
    this._logEvent('mcp_integration_set', { hasIntegration: !!mcpIntegration });
  }
  
  /**
   * Simulate service unavailability for testing
   */
  simulateServiceUnavailable() {
    this.simulationActive = true;
    this.simulatedState = DETECTION_STATES.UNAVAILABLE;
    this._logEvent('simulation_activated', { state: 'unavailable' });
  }
  
  /**
   * Simulate service degradation for testing
   */
  simulateServiceDegraded() {
    this.simulationActive = true;
    this.simulatedState = DETECTION_STATES.DEGRADED;
    this._logEvent('simulation_activated', { state: 'degraded' });
  }
  
  /**
   * Reset service simulation to normal detection
   */
  resetSimulation() {
    this.simulationActive = false;
    this.simulatedState = null;
    this._logEvent('simulation_reset', {});
  }
  
  /**
   * Force immediate fallback trigger for testing
   */
  triggerFallback() {
    this._triggerFallbackProcedures('manual_trigger');
  }
  
  // Private methods
  
  /**
   * Initialize detection system
   * @private
   */
  _initializeDetection() {
    this._logEvent('detector_initialized', { 
      config: {
        healthCheckInterval: this.healthCheckInterval,
        healthCheckTimeout: this.healthCheckTimeout,
        degradationThreshold: this.degradationThreshold,
        failureThreshold: this.failureThreshold,
        recoveryThreshold: this.recoveryThreshold
      }
    });
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
   * Perform actual health check against Redis
   * @private
   */
  async _performHealthCheck() {
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Health check timeout after ${this.healthCheckTimeout}ms`));
      }, this.healthCheckTimeout);
      
      try {
        // Import Redis dynamically
        const redis = require('redis');
        
        // Create temporary client for health check
        const client = redis.createClient({
          url: this.connectionString,
          database: this.config.db,
          socket: {
            connectTimeout: this.healthCheckTimeout,
            lazyConnect: true
          }
        });
        
        // Connect and ping
        await client.connect();
        const pingResult = await client.ping();
        await client.quit();
        
        clearTimeout(timeout);
        resolve({
          ping: pingResult,
          connected: true
        });
        
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }
  
  /**
   * Determine health status from check results
   * @private
   */
  _determineHealthStatus(healthResult, responseTime) {
    if (!healthResult || !healthResult.connected) {
      return {
        status: HEALTH_STATUS.UNHEALTHY,
        isHealthy: false,
        reason: 'Unable to connect to Redis'
      };
    }
    
    if (healthResult.ping !== 'PONG') {
      return {
        status: HEALTH_STATUS.UNHEALTHY,
        isHealthy: false,
        reason: `Invalid ping response: ${healthResult.ping}`
      };
    }
    
    // Check response time thresholds
    if (responseTime > 5000) {
      return {
        status: HEALTH_STATUS.TIMEOUT,
        isHealthy: false,
        reason: `Response time too slow: ${responseTime}ms`
      };
    }
    
    if (responseTime > 1000) {
      return {
        status: HEALTH_STATUS.DEGRADED,
        isHealthy: true,
        reason: `Slow response time: ${responseTime}ms`
      };
    }
    
    return {
      status: HEALTH_STATUS.HEALTHY,
      isHealthy: true,
      reason: 'Service responding normally'
    };
  }
  
  /**
   * Update service state based on health status
   * @private
   */
  _updateServiceState(healthStatus) {
    const previousState = this.state;
    
    if (healthStatus.isHealthy) {
      this.consecutiveSuccesses++;
      this.consecutiveFailures = 0;
      
      // Determine if we should transition to available
      if (healthStatus.status === HEALTH_STATUS.HEALTHY) {
        if (this.consecutiveSuccesses >= this.recoveryThreshold) {
          this._transitionToState(DETECTION_STATES.AVAILABLE);
        }
      } else if (healthStatus.status === HEALTH_STATUS.DEGRADED) {
        this._transitionToState(DETECTION_STATES.DEGRADED);
      }
      
    } else {
      this.consecutiveFailures++;
      this.consecutiveSuccesses = 0;
      
      // Determine degradation or unavailability
      if (this.consecutiveFailures >= this.failureThreshold) {
        this._transitionToState(DETECTION_STATES.UNAVAILABLE);
      } else if (this.consecutiveFailures >= this.degradationThreshold) {
        this._transitionToState(DETECTION_STATES.DEGRADED);
      }
    }
    
    // Log state transition
    if (previousState !== this.state) {
      this._logStateTransition(previousState, this.state, healthStatus);
    }
  }
  
  /**
   * Transition to new service state
   * @private
   */
  _transitionToState(newState) {
    const previousState = this.state;
    this.state = newState;
    
    // Update downtime tracking
    if (newState === DETECTION_STATES.UNAVAILABLE && !this.metrics.downtimeStart) {
      this.metrics.downtimeStart = Date.now();
    } else if (newState === DETECTION_STATES.AVAILABLE && this.metrics.downtimeStart) {
      this.metrics.totalDowntime += Date.now() - this.metrics.downtimeStart;
      this.metrics.downtimeStart = null;
    }
    
    // Emit state change event
    this.emit('stateChanged', { from: previousState, to: newState });
    
    // Trigger fallback procedures if service becomes unavailable
    if (newState === DETECTION_STATES.UNAVAILABLE) {
      this._triggerFallbackProcedures('service_unavailable');
    }
  }
  
  /**
   * Trigger fallback procedures
   * @private
   */
  _triggerFallbackProcedures(reason) {
    this.emit('fallbackTriggered', { reason, state: this.state });
    
    // Execute registered fallback triggers
    this.fallbackTriggers.forEach(callback => {
      try {
        callback(reason, this.state, this.lastHealthStatus);
      } catch (error) {
        this._logError('fallback_trigger_error', { error: error.message });
      }
    });
    
    // Trigger MCP integration if available
    if (this.mcpIntegration && typeof this.mcpIntegration.activateFallback === 'function') {
      try {
        this.mcpIntegration.activateFallback(reason, this.getMetrics());
      } catch (error) {
        this._logError('mcp_fallback_error', { error: error.message });
      }
    }
    
    this._logEvent('fallback_triggered', { reason, state: this.state });
  }
  
  /**
   * Update performance metrics
   * @private
   */
  _updateMetrics(success, responseTime) {
    this.metrics.lastCheckTime = Date.now();
    
    if (success) {
      this.metrics.successfulChecks++;
    } else {
      this.metrics.failedChecks++;
      if (responseTime >= this.healthCheckTimeout) {
        this.metrics.timeoutChecks++;
      }
    }
    
    // Update average response time
    const totalResponseTime = (this.metrics.averageResponseTime * (this.metrics.totalChecks - 1)) + responseTime;
    this.metrics.averageResponseTime = totalResponseTime / this.metrics.totalChecks;
  }
  
  /**
   * Get simulated health status for testing
   * @private
   */
  _getSimulatedHealthStatus() {
    const simulatedResponse = {
      timestamp: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
      serviceState: this.simulatedState
    };
    
    switch (this.simulatedState) {
      case DETECTION_STATES.AVAILABLE:
        return {
          ...simulatedResponse,
          status: HEALTH_STATUS.HEALTHY,
          isHealthy: true,
          reason: 'Simulated healthy service'
        };
        
      case DETECTION_STATES.DEGRADED:
        return {
          ...simulatedResponse,
          status: HEALTH_STATUS.DEGRADED,
          isHealthy: true,
          responseTime: 1500,
          reason: 'Simulated degraded service'
        };
        
      case DETECTION_STATES.UNAVAILABLE:
        return {
          ...simulatedResponse,
          status: HEALTH_STATUS.UNHEALTHY,
          isHealthy: false,
          error: 'Simulated service unavailable',
          reason: 'Simulated service unavailability'
        };
        
      default:
        return {
          ...simulatedResponse,
          status: HEALTH_STATUS.ERROR,
          isHealthy: false,
          error: 'Unknown simulation state',
          reason: 'Simulation configuration error'
        };
    }
  }
  
  /**
   * Log state transition
   * @private
   */
  _logStateTransition(fromState, toState, healthStatus) {
    this._logEvent('state_transition', {
      from: fromState,
      to: toState,
      reason: healthStatus.reason,
      consecutiveFailures: this.consecutiveFailures,
      consecutiveSuccesses: this.consecutiveSuccesses
    });
  }
  
  /**
   * Log event with structured format
   * @private
   */
  _logEvent(eventType, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      component: 'RedisDetector',
      data
    };
    
    // Emit for external listeners
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
      component: 'RedisDetector',
      level: 'error',
      data
    };
    
    // Emit for external listeners
    this.emit('error_logged', errorEntry);
  }
}

module.exports = {
  RedisDetector,
  DETECTION_STATES,
  HEALTH_STATUS
};