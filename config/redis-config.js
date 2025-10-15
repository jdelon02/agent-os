/**
 * Redis Configuration Factory
 * 
 * @description Configuration factory for Redis client with Agent OS integration patterns
 * @module RedisConfig
 * @requires redis
 * @version 1.0.0
 * 
 * Features:
 * - Environment-based configuration
 * - Connection pooling and keepAlive
 * - Reconnection strategies with exponential backoff
 * - Database separation (Database 1 for Agent OS)
 * - Error handling and timeout management
 * - Agent OS integration patterns
 */

/**
 * Default Redis configuration values
 * Following Agent OS patterns for reliable operation
 */
const DEFAULT_CONFIG = {
  // Connection settings
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  db: 1, // Agent OS dedicated database
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  
  // Connection lifecycle settings
  lazyConnect: true, // Don't connect immediately, allow manual connection
  keepAlive: 30000, // Keep connection alive for 30 seconds
  connectTimeout: 10000, // 10 second connection timeout
  lazyConnectTimeout: 0, // No timeout for lazy connect
  
  // Retry and reconnection settings
  retryDelayOnFailover: 100, // Start with 100ms retry delay
  retryDelayOnClusterDown: 300, // Cluster down retry delay
  maxRetriesPerRequest: 3, // Maximum retries per request
  enableReadyCheck: true, // Check if Redis is ready
  maxLoadingTimeout: 5000, // Maximum loading timeout
  
  // Connection pool settings
  family: 4, // IPv4
  keepAliveInitialDelay: 0, // Initial keep-alive delay
  
  // Agent OS specific settings
  keyPrefix: '', // No global prefix, use semantic keys
  readOnly: false, // Full read/write access
  enableAutoPipelining: true, // Enable automatic pipelining for performance
  
  // Health check settings
  pingInterval: 30000, // Ping every 30 seconds
  healthCheckInterval: 60000, // Health check every minute
  
  // TTL settings for Agent OS workflows
  defaultTTL: {
    workflows: 7200, // 2 hours for workflow state
    handoffs: 172800, // 48 hours for handoff data
    checkpoints: 3600, // 1 hour for checkpoints
    events: 86400, // 24 hours for event logs
  }
};

/**
 * Environment-specific configuration overrides
 * Allows different settings based on deployment environment
 */
const ENVIRONMENT_CONFIGS = {
  development: {
    connectTimeout: 5000, // Faster timeout for development
    retryDelayOnFailover: 50, // Faster retries in development
    pingInterval: 10000, // More frequent health checks
    enableAutoPipelining: false, // Disable for easier debugging
  },
  
  test: {
    db: 15, // Use database 15 for testing to avoid conflicts
    connectTimeout: 1000, // Very fast timeout for tests
    retryDelayOnFailover: 10, // Immediate retries for tests
    maxRetriesPerRequest: 1, // Minimal retries for faster test execution
    pingInterval: 5000, // Frequent health checks for test reliability
    enableAutoPipelining: false, // Disable for deterministic test behavior
  },
  
  production: {
    connectTimeout: 15000, // Longer timeout for production reliability
    retryDelayOnFailover: 200, // Conservative retry delays
    maxRetriesPerRequest: 5, // More retries for production reliability
    pingInterval: 60000, // Less frequent pings to reduce overhead
    enableAutoPipelining: true, // Enable for production performance
    keepAlive: 60000, // Longer keep-alive for production
  },
  
  staging: {
    connectTimeout: 10000, // Production-like but faster
    retryDelayOnFailover: 150, // Moderate retry delays
    maxRetriesPerRequest: 4, // Moderate retries
    pingInterval: 45000, // Moderate health check frequency
  }
};

/**
 * Create Redis client configuration based on environment and options
 * 
 * @param {Object} options - Configuration options override
 * @param {string} options.environment - Environment (development|test|production|staging)
 * @param {string} options.url - Redis connection URL
 * @param {number} options.db - Database number
 * @param {Object} options.customConfig - Additional configuration overrides
 * @returns {Object} Complete Redis client configuration
 */
function createRedisConfig(options = {}) {
  // Determine environment
  const environment = options.environment || 
                     process.env.NODE_ENV || 
                     process.env.AGENT_OS_ENV || 
                     'development';
  
  // Get environment-specific config
  const envConfig = ENVIRONMENT_CONFIGS[environment] || {};
  
  // Merge configurations with precedence: custom > environment > default
  const config = {
    ...DEFAULT_CONFIG,
    ...envConfig,
    ...options.customConfig,
    // Direct options override everything
    ...(options.url && { url: options.url }),
    ...(options.db !== undefined && { db: options.db }),
  };
  
  // Add Agent OS metadata
  config.metadata = {
    environment,
    agentOS: {
      version: '1.0.0',
      component: 'Redis MCP Phase Handoff',
      session: `agent-os-redis-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
  };
  
  // Validate configuration
  validateConfig(config);
  
  return config;
}

/**
 * Create Redis client configuration for specific Agent OS use cases
 * 
 * @param {string} useCase - Use case (workflow|handoff|checkpoint|event)
 * @param {Object} options - Additional options
 * @returns {Object} Use case-specific Redis configuration
 */
function createUseCaseConfig(useCase, options = {}) {
  const baseConfig = createRedisConfig(options);
  
  const useCaseConfigs = {
    workflow: {
      keyPrefix: 'workflows:',
      defaultTTL: baseConfig.defaultTTL.workflows,
      description: 'Workflow state management configuration',
      optimizedFor: 'state_persistence'
    },
    
    handoff: {
      keyPrefix: 'handoffs:',
      defaultTTL: baseConfig.defaultTTL.handoffs,
      description: 'Role handoff data configuration',
      optimizedFor: 'data_integrity'
    },
    
    checkpoint: {
      keyPrefix: 'checkpoints:',
      defaultTTL: baseConfig.defaultTTL.checkpoints,
      description: 'User interaction checkpoint configuration',
      optimizedFor: 'context_preservation'
    },
    
    event: {
      keyPrefix: 'events:',
      defaultTTL: baseConfig.defaultTTL.events,
      description: 'Event logging configuration',
      optimizedFor: 'audit_trail'
    }
  };
  
  const useCaseConfig = useCaseConfigs[useCase];
  if (!useCaseConfig) {
    throw new Error(`Invalid use case: ${useCase}. Valid options: ${Object.keys(useCaseConfigs).join(', ')}`);
  }
  
  return {
    ...baseConfig,
    useCase: {
      type: useCase,
      ...useCaseConfig
    }
  };
}

/**
 * Create test configuration for Redis client testing
 * Optimized for test execution speed and isolation
 * 
 * @param {Object} options - Test-specific options
 * @returns {Object} Test-optimized Redis configuration
 */
function createTestConfig(options = {}) {
  return createRedisConfig({
    environment: 'test',
    customConfig: {
      // Fast test execution
      connectTimeout: 500,
      retryDelayOnFailover: 10,
      maxRetriesPerRequest: 1,
      
      // Test isolation
      db: options.testDb || 15,
      keyPrefix: `test:${Date.now()}:`,
      
      // Minimal TTL for test cleanup
      defaultTTL: {
        workflows: 300, // 5 minutes
        handoffs: 600, // 10 minutes
        checkpoints: 180, // 3 minutes
        events: 300, // 5 minutes
      },
      
      // Test-specific settings
      enableAutoPipelining: false,
      pingInterval: 2000,
      ...options
    }
  });
}

/**
 * Create production configuration with enhanced reliability
 * Optimized for production deployment with monitoring
 * 
 * @param {Object} options - Production-specific options
 * @returns {Object} Production-optimized Redis configuration
 */
function createProductionConfig(options = {}) {
  return createRedisConfig({
    environment: 'production',
    customConfig: {
      // Production reliability
      connectTimeout: 20000,
      retryDelayOnFailover: 300,
      maxRetriesPerRequest: 5,
      
      // Performance optimization
      enableAutoPipelining: true,
      keepAlive: 90000,
      
      // Production monitoring
      pingInterval: 120000, // 2 minutes
      healthCheckInterval: 300000, // 5 minutes
      
      // Extended TTL for production workloads
      defaultTTL: {
        workflows: 14400, // 4 hours
        handoffs: 259200, // 72 hours
        checkpoints: 7200, // 2 hours
        events: 172800, // 48 hours
      },
      
      ...options
    }
  });
}

/**
 * Validate Redis configuration for completeness and correctness
 * 
 * @param {Object} config - Redis configuration to validate
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
  // Required fields
  const requiredFields = ['url', 'db'];
  for (const field of requiredFields) {
    if (config[field] === undefined) {
      throw new Error(`Required Redis config field missing: ${field}`);
    }
  }
  
  // Database number validation
  if (typeof config.db !== 'number' || config.db < 0 || config.db > 15) {
    throw new Error(`Invalid Redis database number: ${config.db}. Must be 0-15`);
  }
  
  // Timeout validations
  if (config.connectTimeout <= 0) {
    throw new Error(`Invalid connectTimeout: ${config.connectTimeout}. Must be positive`);
  }
  
  if (config.retryDelayOnFailover < 0) {
    throw new Error(`Invalid retryDelayOnFailover: ${config.retryDelayOnFailover}. Must be non-negative`);
  }
  
  if (config.maxRetriesPerRequest < 0) {
    throw new Error(`Invalid maxRetriesPerRequest: ${config.maxRetriesPerRequest}. Must be non-negative`);
  }
  
  // TTL validation
  if (config.defaultTTL) {
    for (const [key, value] of Object.entries(config.defaultTTL)) {
      if (typeof value !== 'number' || value <= 0) {
        throw new Error(`Invalid TTL for ${key}: ${value}. Must be positive number`);
      }
    }
  }
  
  // URL validation (basic)
  if (!config.url.startsWith('redis://') && !config.url.startsWith('rediss://')) {
    throw new Error(`Invalid Redis URL format: ${config.url}. Must start with redis:// or rediss://`);
  }
}

/**
 * Get connection string with credentials properly encoded
 * 
 * @param {Object} config - Redis configuration
 * @returns {string} Properly formatted connection string
 */
function getConnectionString(config) {
  let connectionUrl = config.url;
  
  // Add credentials if provided
  if (config.username || config.password) {
    const url = new URL(connectionUrl);
    if (config.username) url.username = config.username;
    if (config.password) url.password = config.password;
    connectionUrl = url.toString();
  }
  
  return connectionUrl;
}

/**
 * Get Agent OS specific configuration summary for logging
 * 
 * @param {Object} config - Redis configuration
 * @returns {Object} Configuration summary safe for logging
 */
function getConfigSummary(config) {
  return {
    environment: config.metadata?.environment,
    database: config.db,
    useCase: config.useCase?.type,
    connectionTimeout: config.connectTimeout,
    maxRetries: config.maxRetriesPerRequest,
    ttlSettings: config.defaultTTL,
    features: {
      autoPipelining: config.enableAutoPipelining,
      keepAlive: !!config.keepAlive,
      lazyConnect: config.lazyConnect
    }
  };
}

// Export configuration functions
module.exports = {
  // Main configuration functions
  createRedisConfig,
  createUseCaseConfig,
  createTestConfig,
  createProductionConfig,
  
  // Utility functions
  validateConfig,
  getConnectionString,
  getConfigSummary,
  
  // Constants for external use
  DEFAULT_CONFIG,
  ENVIRONMENT_CONFIGS,
  
  // Agent OS specific constants
  AGENT_OS_DATABASE: DEFAULT_CONFIG.db,
  DEFAULT_TTL: DEFAULT_CONFIG.defaultTTL
};