/**
 * State Query Interface
 * 
 * @description Efficient workflow state retrieval and filtering with Redis optimization
 * @module StateQuery
 * @requires events
 * @version 1.0.0
 * 
 * Features:
 * - Query Interface Pattern for flexible state filtering
 * - Redis key pattern matching with SCAN operations
 * - Efficient batch operations and result caching
 * - State history tracking and timeline queries
 * - Data aggregation and statistics
 * - Query optimization and performance monitoring
 * - Agent OS integration patterns
 */

const { EventEmitter } = require('events');
const { RedisClient } = require('./redis-client');
const { WorkflowStateManager, WORKFLOW_STATUS, WORKFLOW_ROLES } = require('./workflow-state-manager');
const { createUseCaseConfig } = require('../config/redis-config');

/**
 * Query result pagination settings
 */
const PAGINATION_DEFAULTS = {
  limit: 50,
  offset: 0,
  maxLimit: 1000
};

/**
 * Cache settings for query results
 */
const CACHE_SETTINGS = {
  defaultTTL: 300, // 5 minutes
  maxCacheSize: 1000,
  enableCache: true
};

/**
 * Query operation types
 */
const QUERY_OPERATIONS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  BETWEEN: 'between',
  IN: 'in',
  NOT_IN: 'not_in',
  CONTAINS: 'contains',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with'
};

/**
 * State Query Interface implementing Query Interface Pattern
 * 
 * Implements:
 * - Query Interface Pattern for flexible filtering
 * - Builder Pattern for complex query construction
 * - Observer Pattern for query result notifications
 * - Strategy Pattern for different query optimization approaches
 */
class StateQuery extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Initialize configuration for workflow queries
    this.config = createUseCaseConfig('workflow', config);
    this.redisClient = new RedisClient(this.config);
    this.stateManager = new WorkflowStateManager(this.config);
    this.isConnected = false;
    
    // Query cache for performance optimization
    this.queryCache = new Map();
    this.cacheEnabled = config.enableCache !== false;
    this.cacheTTL = config.cacheTTL || CACHE_SETTINGS.defaultTTL;
    
    // Performance tracking
    this.metrics = {
      queriesExecuted: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageQueryTime: 0,
      scanOperations: 0,
      totalKeysScanned: 0,
      filterOperations: 0
    };
    
    // Query optimization settings
    this.optimization = {
      enableBatching: true,
      batchSize: config.batchSize || 100,
      enableParallelScanning: true,
      maxConcurrentScans: config.maxConcurrentScans || 5
    };
    
    this._initializeQuery();
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
      this._logEvent('query_interface_initialized', {});
      
    } catch (error) {
      this.emit('error', error);
      throw new Error(`Failed to initialize StateQuery: ${error.message}`);
    }
  }
  
  /**
   * Find workflow states by current role
   * @param {string} role - Role to filter by
   * @param {Object} options - Query options (limit, offset, includeExpired)
   * @returns {Promise<Array>} Matching workflow states
   */
  async findByRole(role, options = {}) {
    const startTime = Date.now();
    this.metrics.queriesExecuted++;
    
    try {
      await this.initialize();
      
      // Validate role
      if (!Object.values(WORKFLOW_ROLES).includes(role)) {
        throw new Error(`Invalid role: ${role}`);
      }
      
      // Check cache first
      const cacheKey = this._generateCacheKey('role', { role, ...options });
      const cachedResult = this._getCachedResult(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return cachedResult;
      }
      
      this.metrics.cacheMisses++;
      
      // Build query criteria
      const criteria = {
        currentRole: { operation: QUERY_OPERATIONS.EQUALS, value: role }
      };
      
      // Execute query
      const results = await this._executeQuery(criteria, options);
      
      // Cache results
      this._cacheResult(cacheKey, results);
      
      // Update metrics
      this._updateQueryMetrics(startTime);
      
      this.emit('queryExecuted', { type: 'findByRole', role, resultCount: results.length });
      
      return results;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Find workflow states by status
   * @param {string} status - Status to filter by
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Matching workflow states
   */
  async findByStatus(status, options = {}) {
    const startTime = Date.now();
    this.metrics.queriesExecuted++;
    
    try {
      await this.initialize();
      
      // Validate status
      if (!Object.values(WORKFLOW_STATUS).includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }
      
      const cacheKey = this._generateCacheKey('status', { status, ...options });
      const cachedResult = this._getCachedResult(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return cachedResult;
      }
      
      this.metrics.cacheMisses++;
      
      const criteria = {
        status: { operation: QUERY_OPERATIONS.EQUALS, value: status }
      };
      
      const results = await this._executeQuery(criteria, options);
      this._cacheResult(cacheKey, results);
      this._updateQueryMetrics(startTime);
      
      this.emit('queryExecuted', { type: 'findByStatus', status, resultCount: results.length });
      
      return results;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Find workflow states by role and status combination
   * @param {string} role - Role to filter by
   * @param {string} status - Status to filter by
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Matching workflow states
   */
  async findByRoleAndStatus(role, status, options = {}) {
    const startTime = Date.now();
    this.metrics.queriesExecuted++;
    
    try {
      await this.initialize();
      
      // Validate inputs
      if (!Object.values(WORKFLOW_ROLES).includes(role)) {
        throw new Error(`Invalid role: ${role}`);
      }
      if (!Object.values(WORKFLOW_STATUS).includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }
      
      const cacheKey = this._generateCacheKey('role_status', { role, status, ...options });
      const cachedResult = this._getCachedResult(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return cachedResult;
      }
      
      this.metrics.cacheMisses++;
      
      const criteria = {
        currentRole: { operation: QUERY_OPERATIONS.EQUALS, value: role },
        status: { operation: QUERY_OPERATIONS.EQUALS, value: status }
      };
      
      const results = await this._executeQuery(criteria, options);
      this._cacheResult(cacheKey, results);
      this._updateQueryMetrics(startTime);
      
      this.emit('queryExecuted', { 
        type: 'findByRoleAndStatus', 
        role, 
        status, 
        resultCount: results.length 
      });
      
      return results;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Find workflow states by progress range
   * @param {number} minProgress - Minimum progress value
   * @param {number} maxProgress - Maximum progress value
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Matching workflow states
   */
  async findByProgressRange(minProgress, maxProgress, options = {}) {
    const startTime = Date.now();
    this.metrics.queriesExecuted++;
    
    try {
      await this.initialize();
      
      // Validate progress range
      if (minProgress < 0 || maxProgress > 100 || minProgress > maxProgress) {
        throw new Error('Invalid progress range. Must be 0-100 and min <= max');
      }
      
      const cacheKey = this._generateCacheKey('progress_range', { 
        minProgress, 
        maxProgress, 
        ...options 
      });
      const cachedResult = this._getCachedResult(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return cachedResult;
      }
      
      this.metrics.cacheMisses++;
      
      const criteria = {
        progress: { 
          operation: QUERY_OPERATIONS.BETWEEN, 
          value: [minProgress, maxProgress] 
        }
      };
      
      const results = await this._executeQuery(criteria, options);
      this._cacheResult(cacheKey, results);
      this._updateQueryMetrics(startTime);
      
      this.emit('queryExecuted', { 
        type: 'findByProgressRange', 
        minProgress, 
        maxProgress, 
        resultCount: results.length 
      });
      
      return results;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Find workflow states with complex criteria
   * @param {Object} criteria - Complex query criteria
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Matching workflow states
   */
  async findByCriteria(criteria, options = {}) {
    const startTime = Date.now();
    this.metrics.queriesExecuted++;
    
    try {
      await this.initialize();
      
      const cacheKey = this._generateCacheKey('complex_criteria', { criteria, ...options });
      const cachedResult = this._getCachedResult(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return cachedResult;
      }
      
      this.metrics.cacheMisses++;
      
      const results = await this._executeQuery(criteria, options);
      this._cacheResult(cacheKey, results);
      this._updateQueryMetrics(startTime);
      
      this.emit('queryExecuted', { 
        type: 'findByCriteria', 
        criteriaCount: Object.keys(criteria).length,
        resultCount: results.length 
      });
      
      return results;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get all workflow states with pagination
   * @param {Object} options - Query options (limit, offset, sortBy, sortOrder)
   * @returns {Promise<Object>} Paginated results with metadata
   */
  async getAllStates(options = {}) {
    const startTime = Date.now();
    this.metrics.queriesExecuted++;
    
    try {
      await this.initialize();
      
      const limit = Math.min(options.limit || PAGINATION_DEFAULTS.limit, PAGINATION_DEFAULTS.maxLimit);
      const offset = options.offset || PAGINATION_DEFAULTS.offset;
      
      // Get all workflow keys using SCAN
      const allKeys = await this._scanWorkflowKeys();
      
      // Apply pagination
      const paginatedKeys = allKeys.slice(offset, offset + limit);
      
      // Retrieve states in batches
      const states = await this._batchRetrieveStates(paginatedKeys);
      
      // Apply sorting if requested
      let sortedStates = states;
      if (options.sortBy) {
        sortedStates = this._sortResults(states, options.sortBy, options.sortOrder);
      }
      
      this._updateQueryMetrics(startTime);
      
      const result = {
        data: sortedStates,
        pagination: {
          total: allKeys.length,
          limit,
          offset,
          hasMore: offset + limit < allKeys.length
        },
        metadata: {
          queryTime: Date.now() - startTime,
          keysScanned: allKeys.length,
          statesRetrieved: states.length
        }
      };
      
      this.emit('queryExecuted', { 
        type: 'getAllStates', 
        total: allKeys.length,
        returned: sortedStates.length 
      });
      
      return result;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Get workflow state statistics
   * @param {Object} options - Statistics options
   * @returns {Promise<Object>} Aggregated statistics
   */
  async getStatistics(options = {}) {
    const startTime = Date.now();
    this.metrics.queriesExecuted++;
    
    try {
      await this.initialize();
      
      const cacheKey = this._generateCacheKey('statistics', options);
      const cachedResult = this._getCachedResult(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return cachedResult;
      }
      
      this.metrics.cacheMisses++;
      
      // Get all workflow states
      const allKeys = await this._scanWorkflowKeys();
      const allStates = await this._batchRetrieveStates(allKeys);
      
      // Calculate statistics
      const statistics = this._calculateStatistics(allStates);
      
      this._cacheResult(cacheKey, statistics);
      this._updateQueryMetrics(startTime);
      
      this.emit('queryExecuted', { 
        type: 'getStatistics', 
        totalStates: allStates.length 
      });
      
      return statistics;
      
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Clear query cache
   */
  clearCache() {
    this.queryCache.clear();
    this.emit('cacheCleared');
    this._logEvent('cache_cleared', { size: this.queryCache.size });
  }
  
  /**
   * Get query performance metrics
   * @returns {Object} Performance metrics and statistics
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.queryCache.size,
      cacheHitRate: this.metrics.queriesExecuted > 0 ? 
        (this.metrics.cacheHits / this.metrics.queriesExecuted) * 100 : 0,
      isConnected: this.isConnected,
      cacheEnabled: this.cacheEnabled,
      optimization: this.optimization
    };
  }
  
  /**
   * Disconnect and cleanup
   */
  async disconnect() {
    if (this.isConnected) {
      await this.redisClient.disconnect();
      await this.stateManager.disconnect();
      this.isConnected = false;
      this.clearCache();
      this.emit('disconnected');
    }
  }
  
  // Private methods
  
  /**
   * Initialize query interface
   * @private
   */
  _initializeQuery() {
    // Set up cleanup interval for cache
    if (this.cacheEnabled) {
      setInterval(() => {
        this._cleanupCache();
      }, this.cacheTTL * 1000);
    }
    
    this._logEvent('query_interface_created', { 
      cacheEnabled: this.cacheEnabled,
      optimization: this.optimization
    });
  }
  
  /**
   * Execute query with given criteria
   * @private
   */
  async _executeQuery(criteria, options = {}) {
    // Get all workflow keys
    const allKeys = await this._scanWorkflowKeys();
    this.metrics.scanOperations++;
    this.metrics.totalKeysScanned += allKeys.length;
    
    // Apply pagination at key level for efficiency
    const limit = Math.min(options.limit || PAGINATION_DEFAULTS.limit, PAGINATION_DEFAULTS.maxLimit);
    const offset = options.offset || PAGINATION_DEFAULTS.offset;
    
    // Retrieve and filter states
    const matchingStates = [];
    let processed = 0;
    let found = 0;
    
    // Process keys in batches for memory efficiency
    const batchSize = this.optimization.batchSize;
    
    for (let i = 0; i < allKeys.length && found < limit + offset; i += batchSize) {
      const batch = allKeys.slice(i, Math.min(i + batchSize, allKeys.length));
      const batchStates = await this._batchRetrieveStates(batch);
      
      for (const state of batchStates) {
        if (state && this._matchesCriteria(state, criteria)) {
          if (found >= offset) {
            matchingStates.push(state);
          }
          found++;
          
          if (matchingStates.length >= limit) {
            break;
          }
        }
        processed++;
      }
    }
    
    this.metrics.filterOperations++;
    
    // Apply sorting if requested
    if (options.sortBy) {
      return this._sortResults(matchingStates, options.sortBy, options.sortOrder);
    }
    
    return matchingStates;
  }
  
  /**
   * Scan for all workflow keys using Redis SCAN
   * @private
   */
  async _scanWorkflowKeys() {
    const keys = [];
    let cursor = 0;
    
    do {
      // Use Redis SCAN command for efficient key discovery
      const scanResult = await this.redisClient.executeCommand('scan', cursor, 'MATCH', 'workflows:*', 'COUNT', 100);
      
      cursor = parseInt(scanResult[0]);
      const batchKeys = scanResult[1] || [];
      keys.push(...batchKeys);
      
    } while (cursor !== 0);
    
    return keys;
  }
  
  /**
   * Retrieve multiple workflow states in batch
   * @private
   */
  async _batchRetrieveStates(keys) {
    if (!keys.length) {
      return [];
    }
    
    const states = [];
    
    // Process in parallel batches for performance
    if (this.optimization.enableParallelScanning) {
      const batchSize = Math.ceil(keys.length / this.optimization.maxConcurrentScans);
      const batches = [];
      
      for (let i = 0; i < keys.length; i += batchSize) {
        batches.push(keys.slice(i, i + batchSize));
      }
      
      const batchPromises = batches.map(async (batch) => {
        const batchStates = [];
        for (const key of batch) {
          try {
            const projectName = key.replace('workflows:', '');
            const state = await this.stateManager.getState(projectName);
            if (state) {
              batchStates.push(state);
            }
          } catch (error) {
            // Log error but continue processing
            this._logError('batch_retrieval_error', { key, error: error.message });
          }
        }
        return batchStates;
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(batchStates => {
        states.push(...batchStates);
      });
      
    } else {
      // Sequential processing
      for (const key of keys) {
        try {
          const projectName = key.replace('workflows:', '');
          const state = await this.stateManager.getState(projectName);
          if (state) {
            states.push(state);
          }
        } catch (error) {
          this._logError('sequential_retrieval_error', { key, error: error.message });
        }
      }
    }
    
    return states;
  }
  
  /**
   * Check if state matches given criteria
   * @private
   */
  _matchesCriteria(state, criteria) {
    for (const [field, condition] of Object.entries(criteria)) {
      const fieldValue = this._getNestedValue(state, field);
      
      if (!this._evaluateCondition(fieldValue, condition)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Evaluate a single condition
   * @private
   */
  _evaluateCondition(fieldValue, condition) {
    const { operation, value } = condition;
    
    switch (operation) {
      case QUERY_OPERATIONS.EQUALS:
        return fieldValue === value;
        
      case QUERY_OPERATIONS.NOT_EQUALS:
        return fieldValue !== value;
        
      case QUERY_OPERATIONS.GREATER_THAN:
        return fieldValue > value;
        
      case QUERY_OPERATIONS.LESS_THAN:
        return fieldValue < value;
        
      case QUERY_OPERATIONS.BETWEEN:
        return fieldValue >= value[0] && fieldValue <= value[1];
        
      case QUERY_OPERATIONS.IN:
        return Array.isArray(value) && value.includes(fieldValue);
        
      case QUERY_OPERATIONS.NOT_IN:
        return Array.isArray(value) && !value.includes(fieldValue);
        
      case QUERY_OPERATIONS.CONTAINS:
        return typeof fieldValue === 'string' && fieldValue.includes(value);
        
      case QUERY_OPERATIONS.STARTS_WITH:
        return typeof fieldValue === 'string' && fieldValue.startsWith(value);
        
      case QUERY_OPERATIONS.ENDS_WITH:
        return typeof fieldValue === 'string' && fieldValue.endsWith(value);
        
      default:
        return false;
    }
  }
  
  /**
   * Get nested object value by path
   * @private
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
  
  /**
   * Sort query results
   * @private
   */
  _sortResults(results, sortBy, sortOrder = 'asc') {
    return results.sort((a, b) => {
      const aValue = this._getNestedValue(a, sortBy);
      const bValue = this._getNestedValue(b, sortBy);
      
      let comparison = 0;
      
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
  
  /**
   * Calculate statistics for workflow states
   * @private
   */
  _calculateStatistics(states) {
    const stats = {
      total: states.length,
      byStatus: {},
      byRole: {},
      progressDistribution: {
        '0-25': 0,
        '26-50': 0,
        '51-75': 0,
        '76-100': 0
      },
      averageProgress: 0,
      oldestWorkflow: null,
      newestWorkflow: null
    };
    
    if (states.length === 0) {
      return stats;
    }
    
    let totalProgress = 0;
    let oldestDate = new Date();
    let newestDate = new Date(0);
    
    for (const state of states) {
      // Count by status
      stats.byStatus[state.status] = (stats.byStatus[state.status] || 0) + 1;
      
      // Count by role
      stats.byRole[state.currentRole] = (stats.byRole[state.currentRole] || 0) + 1;
      
      // Progress distribution
      if (state.progress <= 25) {
        stats.progressDistribution['0-25']++;
      } else if (state.progress <= 50) {
        stats.progressDistribution['26-50']++;
      } else if (state.progress <= 75) {
        stats.progressDistribution['51-75']++;
      } else {
        stats.progressDistribution['76-100']++;
      }
      
      totalProgress += state.progress;
      
      // Track oldest and newest
      if (state.metadata && state.metadata.createdAt) {
        const createdDate = new Date(state.metadata.createdAt);
        if (createdDate < oldestDate) {
          oldestDate = createdDate;
          stats.oldestWorkflow = state.projectEntityName;
        }
        if (createdDate > newestDate) {
          newestDate = createdDate;
          stats.newestWorkflow = state.projectEntityName;
        }
      }
    }
    
    stats.averageProgress = totalProgress / states.length;
    
    return stats;
  }
  
  /**
   * Generate cache key for query
   * @private
   */
  _generateCacheKey(queryType, params) {
    const keyParts = [queryType];
    
    for (const [key, value] of Object.entries(params)) {
      keyParts.push(`${key}:${JSON.stringify(value)}`);
    }
    
    return keyParts.join('|');
  }
  
  /**
   * Get cached query result
   * @private
   */
  _getCachedResult(cacheKey) {
    if (!this.cacheEnabled) {
      return null;
    }
    
    const cached = this.queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL * 1000) {
      return cached.result;
    }
    
    // Remove expired entry
    if (cached) {
      this.queryCache.delete(cacheKey);
    }
    
    return null;
  }
  
  /**
   * Cache query result
   * @private
   */
  _cacheResult(cacheKey, result) {
    if (!this.cacheEnabled) {
      return;
    }
    
    // Manage cache size
    if (this.queryCache.size >= CACHE_SETTINGS.maxCacheSize) {
      // Remove oldest entries
      const oldestKeys = Array.from(this.queryCache.keys()).slice(0, 100);
      oldestKeys.forEach(key => this.queryCache.delete(key));
    }
    
    this.queryCache.set(cacheKey, {
      result: result,
      timestamp: Date.now()
    });
  }
  
  /**
   * Cleanup expired cache entries
   * @private
   */
  _cleanupCache() {
    const now = Date.now();
    const expireTime = this.cacheTTL * 1000;
    
    for (const [key, entry] of this.queryCache.entries()) {
      if (now - entry.timestamp > expireTime) {
        this.queryCache.delete(key);
      }
    }
  }
  
  /**
   * Update query performance metrics
   * @private
   */
  _updateQueryMetrics(startTime) {
    const queryTime = Date.now() - startTime;
    const totalQueries = this.metrics.queriesExecuted;
    
    this.metrics.averageQueryTime = 
      ((this.metrics.averageQueryTime * (totalQueries - 1)) + queryTime) / totalQueries;
  }
  
  /**
   * Log event with structured format
   * @private
   */
  _logEvent(eventType, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      component: 'StateQuery',
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
      component: 'StateQuery',
      level: 'error',
      data
    };
    
    this.emit('error_logged', errorEntry);
  }
}

/**
 * Query Builder for complex query construction
 */
class QueryBuilder {
  constructor() {
    this.criteria = {};
    this.options = {};
  }
  
  /**
   * Add equals condition
   */
  equals(field, value) {
    this.criteria[field] = { operation: QUERY_OPERATIONS.EQUALS, value };
    return this;
  }
  
  /**
   * Add greater than condition
   */
  greaterThan(field, value) {
    this.criteria[field] = { operation: QUERY_OPERATIONS.GREATER_THAN, value };
    return this;
  }
  
  /**
   * Add between condition
   */
  between(field, min, max) {
    this.criteria[field] = { operation: QUERY_OPERATIONS.BETWEEN, value: [min, max] };
    return this;
  }
  
  /**
   * Add in condition
   */
  in(field, values) {
    this.criteria[field] = { operation: QUERY_OPERATIONS.IN, value: values };
    return this;
  }
  
  /**
   * Add contains condition
   */
  contains(field, value) {
    this.criteria[field] = { operation: QUERY_OPERATIONS.CONTAINS, value };
    return this;
  }
  
  /**
   * Set limit
   */
  limit(limit) {
    this.options.limit = limit;
    return this;
  }
  
  /**
   * Set offset
   */
  offset(offset) {
    this.options.offset = offset;
    return this;
  }
  
  /**
   * Set sort order
   */
  sortBy(field, order = 'asc') {
    this.options.sortBy = field;
    this.options.sortOrder = order;
    return this;
  }
  
  /**
   * Build the query
   */
  build() {
    return {
      criteria: this.criteria,
      options: this.options
    };
  }
}

module.exports = {
  StateQuery,
  QueryBuilder,
  QUERY_OPERATIONS,
  PAGINATION_DEFAULTS,
  CACHE_SETTINGS
};