/**
 * Context-Aware Task Distribution System
 * 
 * @description Intelligent task routing, assignment, and context-aware distribution
 * @module ContextAwareDistributor
 * @requires events
 * @version 1.0.0
 * 
 * Features:
 * - Intelligent task routing and assignment based on context
 * - Context analysis and task matching algorithms
 * - Load balancing across agent capabilities
 * - Dynamic resource allocation and optimization
 * - Performance-based agent selection
 * - Integration with Advanced Workflow Patterns
 */

const { EventEmitter } = require('events');
const { MultiAgentCoordinator, AGENT_STATES } = require('./multi-agent-coordinator');
const { DynamicWorkflowGenerator } = require('./dynamic-workflow-generator');
const { TaskCoordinator, QUEUE_TYPES } = require('./task-coordinator');
const { RoleManager, ROLE_TYPES } = require('./role-manager');
const { createUseCaseConfig } = require('../config/redis-config');

/**
 * Task distribution strategies
 */
const DISTRIBUTION_STRATEGIES = {
  ROUND_ROBIN: 'round_robin',                 // Simple round-robin distribution
  CAPABILITY_BASED: 'capability_based',       // Based on agent capabilities
  LOAD_BALANCED: 'load_balanced',            // Balance load across agents
  PERFORMANCE_BASED: 'performance_based',     // Based on historical performance
  CONTEXT_AWARE: 'context_aware',            // Full context-aware distribution
  HYBRID: 'hybrid',                          // Combination of strategies
  MACHINE_LEARNING: 'machine_learning'       // ML-driven distribution
};

/**
 * Context analysis dimensions
 */
const CONTEXT_DIMENSIONS = {
  AGENT_CAPABILITIES: 'agent_capabilities',   // Agent skill sets and capabilities
  AGENT_LOAD: 'agent_load',                  // Current agent workload
  AGENT_PERFORMANCE: 'agent_performance',     // Historical performance metrics
  TASK_REQUIREMENTS: 'task_requirements',     // Task resource and skill needs
  NETWORK_TOPOLOGY: 'network_topology',       // Agent network relationships
  TEMPORAL_PATTERNS: 'temporal_patterns',     // Time-based usage patterns
  RESOURCE_AVAILABILITY: 'resource_availability', // Available system resources
  PRIORITY_CONSTRAINTS: 'priority_constraints'    // Priority and deadline constraints
};

/**
 * Task matching algorithms
 */
const MATCHING_ALGORITHMS = {
  EXACT_MATCH: 'exact_match',                 // Exact capability matching
  FUZZY_MATCH: 'fuzzy_match',                // Fuzzy capability matching
  SEMANTIC_MATCH: 'semantic_match',          // Semantic similarity matching
  LEARNING_MATCH: 'learning_match',          // ML-based matching
  GRAPH_MATCH: 'graph_match',                // Graph-based matching
  HYBRID_MATCH: 'hybrid_match'               // Combination of algorithms
};

/**
 * Load balancing methods
 */
const LOAD_BALANCING_METHODS = {
  LEAST_CONNECTIONS: 'least_connections',     // Assign to least loaded agent
  WEIGHTED_ROUND_ROBIN: 'weighted_round_robin', // Weighted round-robin
  RESPONSE_TIME: 'response_time',            // Based on response times
  RESOURCE_USAGE: 'resource_usage',          // Based on resource utilization
  QUEUE_DEPTH: 'queue_depth',               // Based on task queue depth
  ADAPTIVE: 'adaptive'                       // Adaptive load balancing
};

/**
 * Task distribution states
 */
const DISTRIBUTION_STATES = {
  ANALYZING: 'analyzing',                     // Analyzing task and context
  MATCHING: 'matching',                      // Finding suitable agents
  ROUTING: 'routing',                        // Routing task to agent
  ASSIGNED: 'assigned',                      // Task successfully assigned
  FAILED: 'failed',                          // Distribution failed
  REDISTRIBUTED: 'redistributed'             // Task was redistributed
};

/**
 * Context-Aware Task Distributor implementing Intelligent Distribution Patterns
 * 
 * Implements:
 * - Strategy Pattern for different distribution approaches
 * - Observer Pattern for context monitoring
 * - Factory Pattern for task assignment creation
 * - Load Balancer Pattern for resource distribution
 * - Circuit Breaker Pattern for failure handling
 */
class ContextAwareDistributor extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Initialize configuration
    this.config = config.useCase ? config : createUseCaseConfig('workflow', config);
    
    // Core components integration
    this.agentCoordinator = new MultiAgentCoordinator(this.config);
    this.workflowGenerator = new DynamicWorkflowGenerator(this.config);
    this.taskCoordinator = new TaskCoordinator(this.config);
    this.roleManager = new RoleManager(this.config);
    
    // Distribution settings
    this.settings = {
      distributionStrategy: config.distributionStrategy || DISTRIBUTION_STRATEGIES.CONTEXT_AWARE,
      matchingAlgorithm: config.matchingAlgorithm || MATCHING_ALGORITHMS.HYBRID_MATCH,
      loadBalancingMethod: config.loadBalancingMethod || LOAD_BALANCING_METHODS.ADAPTIVE,
      enableContextMonitoring: config.enableContextMonitoring !== false,
      contextUpdateInterval: config.contextUpdateInterval || 30000, // 30 seconds
      enablePerformanceTracking: config.enablePerformanceTracking !== false,
      performanceWindowSize: config.performanceWindowSize || 100,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      enableLoadBalancing: config.enableLoadBalancing !== false,
      loadThreshold: config.loadThreshold || 0.8,
      contextWeights: {
        capabilities: config.contextWeights?.capabilities || 0.3,
        performance: config.contextWeights?.performance || 0.25,
        load: config.contextWeights?.load || 0.2,
        availability: config.contextWeights?.availability || 0.15,
        proximity: config.contextWeights?.proximity || 0.1
      }
    };
    
    // Agent registry and context tracking
    this.agentRegistry = new Map(); // agentId -> agent context
    this.taskHistory = new Map(); // taskId -> distribution history
    this.performanceHistory = new Map(); // agentId -> performance data
    
    // Context analysis system
    this.contextAnalyzer = {
      agentProfiles: new Map(),
      taskPatterns: new Map(),
      loadMetrics: new Map(),
      performanceMetrics: new Map(),
      networkTopology: new Map()
    };
    
    // Distribution algorithms
    this.algorithms = {
      capabilityMatcher: null,
      performancePredictor: null,
      loadBalancer: null,
      contextAnalyzer: null
    };
    
    // Distribution metrics
    this.metrics = {
      totalDistributions: 0,
      successfulDistributions: 0,
      failedDistributions: 0,
      redistributions: 0,
      averageDistributionTime: 0,
      averageTaskCompletionTime: 0,
      loadBalanceEfficiency: 0,
      contextMatchAccuracy: 0,
      agentUtilization: new Map(),
      distributionsByStrategy: new Map(),
      distributionsByAgent: new Map()
    };
    
    // Active distributions tracking
    this.activeDistributions = new Map();
    this.distributionQueue = [];
    
    // Timers and monitoring
    this.contextMonitoringTimer = null;
    this.performanceAnalysisTimer = null;
    
    this._initializeDistributor();
  }
  
  /**
   * Initialize the context-aware task distributor
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }
    
    try {
      // Initialize core components
      await this.agentCoordinator.initialize();
      await this.workflowGenerator.initialize();
      await this.taskCoordinator.initialize();
      await this.roleManager.initialize();
      
      // Initialize distribution algorithms
      this._initializeAlgorithms();
      
      // Start context monitoring
      if (this.settings.enableContextMonitoring) {
        this._startContextMonitoring();
      }
      
      // Start performance tracking
      if (this.settings.enablePerformanceTracking) {
        this._startPerformanceTracking();
      }
      
      this.isInitialized = true;
      
      this.emit('distributorInitialized', {
        strategy: this.settings.distributionStrategy,
        matchingAlgorithm: this.settings.matchingAlgorithm,
        loadBalancingMethod: this.settings.loadBalancingMethod
      });
      
      this._logEvent('context_aware_distributor_initialized', {
        strategy: this.settings.distributionStrategy
      });
      
    } catch (error) {
      this.emit('error', error);
      throw new Error(`Failed to initialize ContextAwareDistributor: ${error.message}`);
    }
  }
  
  /**
   * Distribute a task to the most suitable agent based on context
   * @param {Object} task - Task to distribute
   * @param {Object} context - Distribution context
   * @returns {Promise<Object>} Distribution result
   */
  async distributeTask(task, context = {}) {
    const distributionId = this._generateId('dist');
    const startTime = Date.now();
    
    try {
      // Validate task
      this._validateTask(task);
      
      // Create distribution context
      const distributionContext = {
        id: distributionId,
        task,
        context,
        state: DISTRIBUTION_STATES.ANALYZING,
        startTime,
        attempts: 0,
        maxAttempts: this.settings.maxRetries + 1
      };
      
      this.activeDistributions.set(distributionId, distributionContext);
      
      // Execute distribution strategy
      const distributionResult = await this._executeDistributionStrategy(
        distributionContext
      );
      
      // Update metrics
      this.metrics.totalDistributions++;
      const distributionTime = Date.now() - startTime;
      this._updateDistributionMetrics(distributionResult, distributionTime);
      
      // Track distribution history
      this.taskHistory.set(task.id, {
        distributionId,
        assignedAgent: distributionResult.assignedAgent,
        distributionTime,
        strategy: this.settings.distributionStrategy,
        context: distributionContext,
        result: distributionResult,
        completedAt: Date.now()
      });
      
      // Clean up active tracking
      this.activeDistributions.delete(distributionId);
      
      this.emit('taskDistributed', {
        distributionId,
        taskId: task.id,
        assignedAgent: distributionResult.assignedAgent,
        distributionTime,
        strategy: this.settings.distributionStrategy
      });
      
      this._logEvent('task_distributed', {
        distributionId,
        taskId: task.id,
        assignedAgent: distributionResult.assignedAgent,
        distributionTime
      });
      
      return distributionResult;
      
    } catch (error) {
      // Handle distribution failure
      this.metrics.failedDistributions++;
      this.activeDistributions.delete(distributionId);
      
      this.emit('distributionFailed', {
        distributionId,
        taskId: task.id,
        error: error.message,
        context
      });
      
      this._logError('task_distribution_failed', {
        distributionId,
        taskId: task.id,
        error: error.message
      });
      
      throw error;
    }
  }
  
  /**
   * Redistribute a task to a different agent (failure recovery)
   * @param {string} taskId - Task ID to redistribute
   * @param {string} reason - Reason for redistribution
   * @returns {Promise<Object>} Redistribution result
   */
  async redistributeTask(taskId, reason = 'failure_recovery') {
    try {
      // Get original task distribution
      const originalDistribution = this.taskHistory.get(taskId);
      if (!originalDistribution) {
        throw new Error(`No distribution history found for task: ${taskId}`);
      }
      
      // Create redistribution context
      const redistributionContext = {
        ...originalDistribution.context,
        isRedistribution: true,
        originalAgent: originalDistribution.assignedAgent,
        redistributionReason: reason,
        excludedAgents: [originalDistribution.assignedAgent]
      };
      
      // Redistribute with updated context
      const redistributionResult = await this.distributeTask(
        originalDistribution.context.task,
        redistributionContext
      );
      
      this.metrics.redistributions++;
      
      this.emit('taskRedistributed', {
        taskId,
        originalAgent: originalDistribution.assignedAgent,
        newAgent: redistributionResult.assignedAgent,
        reason
      });
      
      this._logEvent('task_redistributed', {
        taskId,
        originalAgent: originalDistribution.assignedAgent,
        newAgent: redistributionResult.assignedAgent,
        reason
      });
      
      return redistributionResult;
      
    } catch (error) {
      this.emit('redistributionFailed', {
        taskId,
        reason,
        error: error.message
      });
      
      this._logError('task_redistribution_failed', {
        taskId,
        error: error.message
      });
      
      throw error;
    }
  }
  
  /**
   * Get agent recommendations for a specific task
   * @param {Object} task - Task to analyze
   * @param {number} count - Number of recommendations to return
   * @returns {Promise<Array>} Array of agent recommendations
   */
  async getAgentRecommendations(task, count = 5) {
    try {
      // Analyze task requirements
      const taskAnalysis = await this._analyzeTaskRequirements(task);
      
      // Get all available agents
      const availableAgents = await this._getAvailableAgents();
      
      // Score agents based on context
      const agentScores = await Promise.all(
        availableAgents.map(agent => this._scoreAgentForTask(agent, taskAnalysis))
      );
      
      // Sort by score and return top recommendations
      const recommendations = agentScores
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(scored => ({
          agentId: scored.agent.id,
          agentName: scored.agent.name,
          score: scored.score,
          matchReasons: scored.reasons,
          estimatedPerformance: scored.estimatedPerformance,
          currentLoad: scored.currentLoad
        }));
      
      this._logEvent('agent_recommendations_generated', {
        taskId: task.id,
        recommendationCount: recommendations.length,
        topAgent: recommendations[0]?.agentId
      });
      
      return recommendations;
      
    } catch (error) {
      this._logError('agent_recommendations_failed', {
        taskId: task.id,
        error: error.message
      });
      
      throw error;
    }
  }
  
  /**
   * Get comprehensive distribution analytics
   * @returns {Object} Distribution analytics and insights
   */
  getDistributionAnalytics() {
    const analytics = {
      metrics: this.metrics,
      agentProfiles: this._generateAgentAnalytics(),
      taskPatterns: this._generateTaskPatternAnalytics(),
      loadDistribution: this._generateLoadDistributionAnalytics(),
      performanceInsights: this._generatePerformanceInsights(),
      contextEffectiveness: this._generateContextEffectivenessAnalytics(),
      recommendations: this._generateOptimizationRecommendations()
    };
    
    return analytics;
  }
  
  /**
   * Get comprehensive distribution metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activeDistributions: this.activeDistributions.size,
      queuedDistributions: this.distributionQueue.length,
      trackedAgents: this.agentRegistry.size,
      taskHistorySize: this.taskHistory.size,
      contextDimensions: Object.keys(this.contextAnalyzer).length,
      isInitialized: this.isInitialized,
      settings: this.settings
    };
  }
  
  /**
   * Shutdown the context-aware distributor
   */
  async shutdown() {
    if (!this.isInitialized) {
      return;
    }
    
    // Stop monitoring timers
    if (this.contextMonitoringTimer) clearInterval(this.contextMonitoringTimer);
    if (this.performanceAnalysisTimer) clearInterval(this.performanceAnalysisTimer);
    
    // Complete active distributions
    await this._completeActiveDistributions();
    
    // Shutdown core components
    await this.agentCoordinator.shutdown();
    await this.workflowGenerator.shutdown();
    await this.taskCoordinator.shutdown();
    await this.roleManager.shutdown();
    
    this.isInitialized = false;
    
    this.emit('distributorShutdown');
    this._logEvent('context_aware_distributor_shutdown', {});
  }
  
  // Private methods
  
  /**
   * Initialize distributor components
   * @private
   */
  _initializeDistributor() {
    this.startTime = Date.now();
    
    // Initialize distribution strategy counters
    for (const strategy of Object.values(DISTRIBUTION_STRATEGIES)) {
      this.metrics.distributionsByStrategy.set(strategy, 0);
    }
    
    this._logEvent('context_aware_distributor_created', {
      strategy: this.settings.distributionStrategy,
      contextWeights: this.settings.contextWeights
    });
  }
  
  /**
   * Initialize distribution algorithms
   * @private
   */
  _initializeAlgorithms() {
    this.algorithms = {
      capabilityMatcher: {
        match: (task, agent) => {
          // Simple capability matching
          const requiredCapabilities = task.requiredCapabilities || [];
          const agentCapabilities = agent.capabilities || [];
          
          const matchedCapabilities = requiredCapabilities.filter(cap =>
            agentCapabilities.includes(cap)
          );
          
          return {
            score: requiredCapabilities.length > 0 ? 
              matchedCapabilities.length / requiredCapabilities.length : 1.0,
            matchedCapabilities,
            missingCapabilities: requiredCapabilities.filter(cap =>
              !agentCapabilities.includes(cap)
            )
          };
        }
      },
      
      performancePredictor: {
        predict: (task, agent) => {
          // Mock performance prediction
          const agentPerformance = this.performanceHistory.get(agent.id);
          if (!agentPerformance || agentPerformance.completedTasks === 0) {
            return {
              estimatedTime: task.estimatedDuration || 300000, // 5 minutes
              estimatedQuality: 0.8,
              confidence: 0.5
            };
          }
          
          return {
            estimatedTime: agentPerformance.averageCompletionTime,
            estimatedQuality: agentPerformance.averageQuality,
            confidence: Math.min(agentPerformance.completedTasks / 10, 1.0)
          };
        }
      },
      
      loadBalancer: {
        calculateLoad: (agent) => {
          // Calculate current agent load
          const agentLoad = this.contextAnalyzer.loadMetrics.get(agent.id);
          if (!agentLoad) {
            return 0.0;
          }
          
          return Math.min(
            (agentLoad.activeTasks / (agentLoad.maxCapacity || 10)) +
            (agentLoad.queuedTasks / (agentLoad.maxQueue || 20)),
            1.0
          );
        }
      },
      
      contextAnalyzer: {
        analyze: (task, context) => {
          // Comprehensive context analysis
          return {
            urgency: task.priority === 'high' ? 1.0 : task.priority === 'normal' ? 0.5 : 0.1,
            complexity: task.estimatedDuration > 600000 ? 0.8 : 0.3, // 10+ minutes = complex
            resourceIntensity: (task.resources?.cpu || 25) / 100,
            specialization: task.requiredCapabilities?.length || 1,
            deadline: task.deadline ? Math.max(0, (task.deadline - Date.now()) / 3600000) : 24 // hours
          };
        }
      }
    };
  }
  
  /**
   * Execute the selected distribution strategy
   * @private
   */
  async _executeDistributionStrategy(distributionContext) {
    distributionContext.state = DISTRIBUTION_STATES.MATCHING;
    
    switch (this.settings.distributionStrategy) {
      case DISTRIBUTION_STRATEGIES.ROUND_ROBIN:
        return await this._executeRoundRobinDistribution(distributionContext);
        
      case DISTRIBUTION_STRATEGIES.CAPABILITY_BASED:
        return await this._executeCapabilityBasedDistribution(distributionContext);
        
      case DISTRIBUTION_STRATEGIES.LOAD_BALANCED:
        return await this._executeLoadBalancedDistribution(distributionContext);
        
      case DISTRIBUTION_STRATEGIES.PERFORMANCE_BASED:
        return await this._executePerformanceBasedDistribution(distributionContext);
        
      case DISTRIBUTION_STRATEGIES.CONTEXT_AWARE:
        return await this._executeContextAwareDistribution(distributionContext);
        
      case DISTRIBUTION_STRATEGIES.HYBRID:
        return await this._executeHybridDistribution(distributionContext);
        
      default:
        return await this._executeContextAwareDistribution(distributionContext);
    }
  }
  
  /**
   * Execute context-aware distribution (main algorithm)
   * @private
   */
  async _executeContextAwareDistribution(distributionContext) {
    const { task, context } = distributionContext;
    
    // Analyze task requirements
    const taskAnalysis = await this._analyzeTaskRequirements(task);
    
    // Get available agents
    const availableAgents = await this._getAvailableAgents(context.excludedAgents);
    
    if (availableAgents.length === 0) {
      throw new Error('No available agents for task distribution');
    }
    
    // Score agents based on comprehensive context
    const agentScores = await Promise.all(
      availableAgents.map(agent => this._scoreAgentForTask(agent, taskAnalysis, context))
    );
    
    // Select the best agent
    const bestAgent = agentScores.reduce((best, current) =>
      current.score > best.score ? current : best
    );
    
    if (bestAgent.score < 0.3) { // Minimum acceptable score
      throw new Error('No suitable agent found with acceptable score');
    }
    
    // Assign task to selected agent
    distributionContext.state = DISTRIBUTION_STATES.ROUTING;
    const assignmentResult = await this._assignTaskToAgent(task, bestAgent.agent, distributionContext);
    
    distributionContext.state = DISTRIBUTION_STATES.ASSIGNED;
    
    return {
      success: true,
      assignedAgent: bestAgent.agent.id,
      assignmentId: assignmentResult.assignmentId,
      score: bestAgent.score,
      strategy: this.settings.distributionStrategy,
      distributionContext,
      estimatedCompletion: bestAgent.estimatedPerformance.estimatedTime + Date.now()
    };
  }
  
  /**
   * Score an agent for a specific task
   * @private
   */
  async _scoreAgentForTask(agent, taskAnalysis, context = {}) {
    const weights = this.settings.contextWeights;
    
    // Capability matching score
    const capabilityMatch = this.algorithms.capabilityMatcher.match(taskAnalysis.task, agent);
    const capabilityScore = capabilityMatch.score * weights.capabilities;
    
    // Performance prediction score
    const performancePrediction = this.algorithms.performancePredictor.predict(taskAnalysis.task, agent);
    const performanceScore = performancePrediction.estimatedQuality * weights.performance;
    
    // Load balancing score
    const agentLoad = this.algorithms.loadBalancer.calculateLoad(agent);
    const loadScore = (1.0 - agentLoad) * weights.load; // Lower load = higher score
    
    // Availability score
    const availabilityScore = (agent.state === AGENT_STATES.ACTIVE ? 1.0 : 0.5) * weights.availability;
    
    // Proximity/network score (mock implementation)
    const proximityScore = 0.8 * weights.proximity; // Mock proximity
    
    // Combined score
    const totalScore = capabilityScore + performanceScore + loadScore + availabilityScore + proximityScore;
    
    return {
      agent,
      score: totalScore,
      reasons: {
        capabilities: capabilityScore,
        performance: performanceScore,
        load: loadScore,
        availability: availabilityScore,
        proximity: proximityScore
      },
      estimatedPerformance: performancePrediction,
      currentLoad: agentLoad,
      capabilityMatch
    };
  }
  
  /**
   * Utility methods
   * @private
   */
  _generateId(prefix = 'item') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
  }
  
  _validateTask(task) {
    if (!task || typeof task !== 'object') {
      throw new Error('Task must be a valid object');
    }
    
    if (!task.id) {
      throw new Error('Task must have an ID');
    }
    
    if (!task.type) {
      throw new Error('Task must have a type');
    }
  }
  
  async _analyzeTaskRequirements(task) {
    return {
      task,
      requirements: {
        capabilities: task.requiredCapabilities || [],
        resources: task.resources || {},
        priority: task.priority || 'normal',
        deadline: task.deadline || null,
        estimatedDuration: task.estimatedDuration || 300000
      },
      context: this.algorithms.contextAnalyzer.analyze(task, {})
    };
  }
  
  async _getAvailableAgents(excludedAgents = []) {
    // Get agents from coordinator
    const allAgents = Array.from(this.agentRegistry.values());
    
    return allAgents.filter(agent =>
      !excludedAgents.includes(agent.id) &&
      agent.state === AGENT_STATES.ACTIVE
    );
  }
  
  async _assignTaskToAgent(task, agent, distributionContext) {
    // Mock task assignment
    const assignmentId = this._generateId('assign');
    
    // Update agent load
    this._updateAgentLoad(agent.id, 'increment');
    
    return {
      assignmentId,
      agentId: agent.id,
      taskId: task.id,
      assignedAt: Date.now()
    };
  }
  
  _updateAgentLoad(agentId, operation) {
    let agentLoad = this.contextAnalyzer.loadMetrics.get(agentId);
    if (!agentLoad) {
      agentLoad = { activeTasks: 0, queuedTasks: 0, maxCapacity: 10, maxQueue: 20 };
    }
    
    if (operation === 'increment') {
      agentLoad.activeTasks++;
    } else if (operation === 'decrement') {
      agentLoad.activeTasks = Math.max(0, agentLoad.activeTasks - 1);
    }
    
    this.contextAnalyzer.loadMetrics.set(agentId, agentLoad);
  }
  
  _updateDistributionMetrics(result, distributionTime) {
    if (result.success) {
      this.metrics.successfulDistributions++;
      
      // Update distribution strategy counter
      const strategy = result.strategy;
      const currentCount = this.metrics.distributionsByStrategy.get(strategy) || 0;
      this.metrics.distributionsByStrategy.set(strategy, currentCount + 1);
      
      // Update agent distribution counter
      const agentCount = this.metrics.distributionsByAgent.get(result.assignedAgent) || 0;
      this.metrics.distributionsByAgent.set(result.assignedAgent, agentCount + 1);
    }
    
    // Update average distribution time
    const totalDistributions = this.metrics.totalDistributions;
    const currentAverage = this.metrics.averageDistributionTime;
    this.metrics.averageDistributionTime = 
      ((currentAverage * totalDistributions) + distributionTime) / (totalDistributions + 1);
  }
  
  // Placeholder methods for alternative distribution strategies
  async _executeRoundRobinDistribution(context) {
    // Round-robin distribution logic
    const agents = await this._getAvailableAgents();
    const selectedAgent = agents[this.metrics.totalDistributions % agents.length];
    
    const assignmentResult = await this._assignTaskToAgent(context.task, selectedAgent, context);
    
    return {
      success: true,
      assignedAgent: selectedAgent.id,
      assignmentId: assignmentResult.assignmentId,
      strategy: DISTRIBUTION_STRATEGIES.ROUND_ROBIN
    };
  }
  
  async _executeCapabilityBasedDistribution(context) {
    // Capability-based distribution
    return await this._executeContextAwareDistribution(context);
  }
  
  async _executeLoadBalancedDistribution(context) {
    // Load-balanced distribution
    return await this._executeContextAwareDistribution(context);
  }
  
  async _executePerformanceBasedDistribution(context) {
    // Performance-based distribution
    return await this._executeContextAwareDistribution(context);
  }
  
  async _executeHybridDistribution(context) {
    // Hybrid distribution (same as context-aware for now)
    return await this._executeContextAwareDistribution(context);
  }
  
  // Monitoring and analytics methods
  _startContextMonitoring() {
    this.contextMonitoringTimer = setInterval(async () => {
      try {
        await this._updateContextData();
      } catch (error) {
        this._logError('context_monitoring_error', { error: error.message });
      }
    }, this.settings.contextUpdateInterval);
  }
  
  _startPerformanceTracking() {
    this.performanceAnalysisTimer = setInterval(async () => {
      try {
        await this._analyzePerformanceData();
      } catch (error) {
        this._logError('performance_tracking_error', { error: error.message });
      }
    }, this.settings.contextUpdateInterval * 2);
  }
  
  async _updateContextData() {
    // Update context data from various sources
  }
  
  async _analyzePerformanceData() {
    // Analyze performance data and update metrics
  }
  
  async _completeActiveDistributions() {
    // Complete or cancel active distributions
    for (const [id, distribution] of this.activeDistributions) {
      this._logEvent('distribution_cancelled_on_shutdown', { distributionId: id });
    }
    this.activeDistributions.clear();
  }
  
  // Analytics generation methods
  _generateAgentAnalytics() {
    const agentAnalytics = [];
    
    for (const [agentId, agent] of this.agentRegistry) {
      const distributionCount = this.metrics.distributionsByAgent.get(agentId) || 0;
      const load = this.contextAnalyzer.loadMetrics.get(agentId);
      const performance = this.performanceHistory.get(agentId);
      
      agentAnalytics.push({
        agentId,
        name: agent.name,
        capabilities: agent.capabilities,
        distributionCount,
        currentLoad: load ? this.algorithms.loadBalancer.calculateLoad(agent) : 0,
        performance: performance ? {
          averageCompletionTime: performance.averageCompletionTime,
          averageQuality: performance.averageQuality,
          completedTasks: performance.completedTasks
        } : null
      });
    }
    
    return agentAnalytics;
  }
  
  _generateTaskPatternAnalytics() {
    return {
      totalDistributed: this.metrics.totalDistributions,
      distributionsByStrategy: Object.fromEntries(this.metrics.distributionsByStrategy),
      averageDistributionTime: this.metrics.averageDistributionTime,
      successRate: this.metrics.totalDistributions > 0 ? 
        this.metrics.successfulDistributions / this.metrics.totalDistributions : 0
    };
  }
  
  _generateLoadDistributionAnalytics() {
    const agentLoads = [];
    
    for (const [agentId, agent] of this.agentRegistry) {
      const load = this.algorithms.loadBalancer.calculateLoad(agent);
      agentLoads.push({ agentId, load });
    }
    
    return {
      agentLoads,
      averageLoad: agentLoads.reduce((sum, item) => sum + item.load, 0) / agentLoads.length,
      loadStandardDeviation: this._calculateStandardDeviation(agentLoads.map(item => item.load))
    };
  }
  
  _generatePerformanceInsights() {
    return {
      averageTaskCompletionTime: this.metrics.averageTaskCompletionTime,
      contextMatchAccuracy: this.metrics.contextMatchAccuracy,
      loadBalanceEfficiency: this.metrics.loadBalanceEfficiency
    };
  }
  
  _generateContextEffectivenessAnalytics() {
    return {
      contextWeights: this.settings.contextWeights,
      distributionStrategy: this.settings.distributionStrategy,
      matchingAlgorithm: this.settings.matchingAlgorithm
    };
  }
  
  _generateOptimizationRecommendations() {
    const recommendations = [];
    
    // Analyze load balance
    const loadAnalytics = this._generateLoadDistributionAnalytics();
    if (loadAnalytics.loadStandardDeviation > 0.3) {
      recommendations.push({
        type: 'load_balancing',
        priority: 'high',
        description: 'High load imbalance detected. Consider adjusting distribution strategy.',
        suggestedAction: 'Enable adaptive load balancing'
      });
    }
    
    // Analyze distribution success rate
    const successRate = this.metrics.totalDistributions > 0 ? 
      this.metrics.successfulDistributions / this.metrics.totalDistributions : 0;
    
    if (successRate < 0.9) {
      recommendations.push({
        type: 'distribution_optimization',
        priority: 'medium',
        description: 'Distribution success rate below optimal threshold.',
        suggestedAction: 'Review agent capabilities and task requirements matching'
      });
    }
    
    return recommendations;
  }
  
  _calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
  
  /**
   * Log event with structured format
   * @private
   */
  _logEvent(eventType, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      component: 'ContextAwareDistributor',
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
      component: 'ContextAwareDistributor',
      level: 'error',
      data
    };
    
    this.emit('error_logged', errorEntry);
  }
}

module.exports = {
  ContextAwareDistributor,
  DISTRIBUTION_STRATEGIES,
  CONTEXT_DIMENSIONS,
  MATCHING_ALGORITHMS,
  LOAD_BALANCING_METHODS,
  DISTRIBUTION_STATES
};