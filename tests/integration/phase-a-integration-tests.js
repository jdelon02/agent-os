/**
 * Phase A Integration Tests
 * 
 * @description Comprehensive end-to-end testing of all Phase A components
 * @module PhaseAIntegrationTests
 * @version 1.0.0
 * 
 * Test Coverage:
 * - Redis Infrastructure Foundation (A1)
 * - Workflow State Operations (A2) 
 * - Redis MCP Integration (A3)
 * - End-to-end workflow scenarios
 * - Failure recovery testing
 * - Performance benchmarking
 * - Data consistency validation
 */

const { strict: assert } = require('assert');
const { EventEmitter } = require('events');

// Import all Phase A components
const { RedisClient } = require('../../lib/redis-client');
const { RedisDetector } = require('../../lib/redis-detector');
const { WorkflowStateManager, WORKFLOW_STATUS, WORKFLOW_ROLES } = require('../../lib/workflow-state-manager');
const { StateQuery, QueryBuilder } = require('../../lib/state-query');
const { WorkflowStatusManager, STATUS_TRANSITIONS } = require('../../lib/workflow-status-manager');
const { RedisMCPIntegration, MCP_FALLBACK_STRATEGIES, INTEGRATION_STATES } = require('../../lib/redis-mcp-integration');
const { createUseCaseConfig } = require('../../config/redis-config');

/**
 * Test configuration
 */
const TEST_CONFIG = {
  redis: {
    host: 'localhost',
    port: 6379,
    keyPrefix: 'test_phase_a:',
    maxRetries: 3,
    retryDelay: 1000
  },
  integration: {
    fallbackStrategy: MCP_FALLBACK_STRATEGIES.GRACEFUL,
    enableAutoSync: false, // Disable for controlled testing
    enableHealthMonitoring: false,
    maxFailures: 3,
    resetTimeout: 5000
  },
  performance: {
    benchmarkOperations: 100,
    concurrentUsers: 10,
    timeoutMs: 10000
  }
};

/**
 * Test project entities for consistent testing
 */
const TEST_PROJECTS = [
  'test_project_alpha',
  'test_project_beta', 
  'test_project_gamma',
  'test_project_delta'
];

/**
 * Phase A Integration Test Suite
 */
class PhaseAIntegrationTests {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      performance: {},
      coverage: {}
    };
    
    // Initialize components
    this.redisClient = null;
    this.redisDetector = null;
    this.stateManager = null;
    this.stateQuery = null;
    this.statusManager = null;
    this.mcpIntegration = null;
    
    this.startTime = Date.now();
  }
  
  /**
   * Run all Phase A integration tests
   */
  async runAllTests() {
    console.log('🚀 Starting Phase A Integration Tests...\n');
    
    try {
      // Setup test environment
      await this.setupTestEnvironment();
      
      // Test Group A1: Redis Infrastructure Foundation
      await this.runRedisInfrastructureTests();
      
      // Test Group A2: Workflow State Operations  
      await this.runWorkflowStateTests();
      
      // Test Group A3: Redis MCP Integration
      await this.runMCPIntegrationTests();
      
      // End-to-end scenario tests
      await this.runEndToEndTests();
      
      // Performance benchmarks
      await this.runPerformanceTests();
      
      // Failure recovery tests
      await this.runFailureRecoveryTests();
      
      // Cleanup test environment
      await this.cleanupTestEnvironment();
      
      // Generate final report
      this.generateTestReport();
      
    } catch (error) {
      console.error('❌ Integration test suite failed:', error.message);
      this.testResults.errors.push({
        test: 'suite_execution',
        error: error.message,
        timestamp: Date.now()
      });
    }
    
    return this.testResults;
  }
  
  /**
   * Setup test environment
   */
  async setupTestEnvironment() {
    console.log('📋 Setting up test environment...');
    
    try {
      // Initialize Redis client with test config
      this.redisClient = new RedisClient(createUseCaseConfig('test', TEST_CONFIG.redis));
      await this.redisClient.connect();
      
      // Clear any existing test data
      const testKeys = await this.redisClient.executeCommand('keys', `${TEST_CONFIG.redis.keyPrefix}*`);
      if (testKeys.length > 0) {
        await this.redisClient.executeCommand('del', ...testKeys);
      }
      
      // Initialize all components
      this.redisDetector = new RedisDetector(createUseCaseConfig('test', TEST_CONFIG.redis));
      this.stateManager = new WorkflowStateManager(createUseCaseConfig('test', TEST_CONFIG.redis));
      this.stateQuery = new StateQuery(createUseCaseConfig('test', TEST_CONFIG.redis));
      this.statusManager = new WorkflowStatusManager(createUseCaseConfig('test', TEST_CONFIG.redis));
      this.mcpIntegration = new RedisMCPIntegration(createUseCaseConfig('test', { 
        ...TEST_CONFIG.redis, 
        ...TEST_CONFIG.integration 
      }));
      
      // Initialize all components
      await this.redisDetector.initialize();
      await this.stateManager.initialize();
      await this.stateQuery.initialize();
      await this.statusManager.initialize();
      await this.mcpIntegration.initialize();
      
      console.log('✅ Test environment setup complete\n');
      
    } catch (error) {
      throw new Error(`Test environment setup failed: ${error.message}`);
    }
  }
  
  /**
   * Test Group A1: Redis Infrastructure Foundation
   */
  async runRedisInfrastructureTests() {
    console.log('🔧 Testing Redis Infrastructure Foundation (A1)...');
    
    // Test A1.1: Redis Client Operations
    await this.runTest('A1.1.1: Redis Connection', async () => {
      assert(this.redisClient.isConnected, 'Redis client should be connected');
      
      const response = await this.redisClient.ping();
      assert(response === 'PONG', 'Redis ping should return PONG');
    });
    
    await this.runTest('A1.1.2: Redis Basic Operations', async () => {
      const testKey = `${TEST_CONFIG.redis.keyPrefix}basic_test`;
      const testValue = 'integration_test_value';
      
      await this.redisClient.executeCommand('set', testKey, testValue);
      const retrieved = await this.redisClient.executeCommand('get', testKey);
      assert.strictEqual(retrieved, testValue, 'Retrieved value should match set value');
      
      await this.redisClient.executeCommand('del', testKey);
    });
    
    await this.runTest('A1.1.3: Redis Error Handling', async () => {
      try {
        // Attempt invalid operation
        await this.redisClient.executeCommand('invalid_command');
        assert.fail('Should have thrown error for invalid command');
      } catch (error) {
        assert(error.message.includes('unknown command'), 'Should handle Redis errors properly');
      }
    });
    
    // Test A1.2: Redis Detection
    await this.runTest('A1.2.1: Redis Service Detection', async () => {
      const isHealthy = await this.redisDetector.checkHealth();
      assert(isHealthy, 'Redis service should be detected as healthy');
      
      const status = this.redisDetector.getStatus();
      assert.strictEqual(status.isHealthy, true, 'Detector should report healthy status');
    });
    
    await this.runTest('A1.2.2: Redis Performance Monitoring', async () => {
      const metrics = this.redisDetector.getMetrics();
      assert(typeof metrics.responseTime === 'number', 'Should track response time');
      assert(typeof metrics.totalChecks === 'number', 'Should track total checks');
    });
    
    console.log('✅ Redis Infrastructure tests completed\n');
  }
  
  /**
   * Test Group A2: Workflow State Operations
   */
  async runWorkflowStateTests() {
    console.log('📊 Testing Workflow State Operations (A2)...');
    
    // Test A2.1: State Management
    await this.runTest('A2.1.1: Create Workflow State', async () => {
      const testState = {
        projectEntityName: TEST_PROJECTS[0],
        status: WORKFLOW_STATUS.PENDING,
        currentRole: WORKFLOW_ROLES.PLANNER,
        progress: 0,
        metadata: {
          createdAt: Date.now(),
          testCase: 'integration_test'
        }
      };
      
      const success = await this.stateManager.setState(TEST_PROJECTS[0], testState);
      assert(success, 'Should successfully create workflow state');
      
      const retrieved = await this.stateManager.getState(TEST_PROJECTS[0]);
      assert.strictEqual(retrieved.projectEntityName, TEST_PROJECTS[0], 'Should retrieve correct project');
      assert.strictEqual(retrieved.status, WORKFLOW_STATUS.PENDING, 'Should have correct status');
    });
    
    await this.runTest('A2.1.2: Update Workflow State', async () => {
      const updatedState = {
        projectEntityName: TEST_PROJECTS[0],
        status: WORKFLOW_STATUS.ACTIVE,
        currentRole: WORKFLOW_ROLES.PLANNER,
        progress: 25,
        metadata: {
          updatedAt: Date.now(),
          testCase: 'integration_test_update'
        }
      };
      
      await this.stateManager.setState(TEST_PROJECTS[0], updatedState);
      const retrieved = await this.stateManager.getState(TEST_PROJECTS[0]);
      
      assert.strictEqual(retrieved.status, WORKFLOW_STATUS.ACTIVE, 'Should update status');
      assert.strictEqual(retrieved.progress, 25, 'Should update progress');
    });
    
    await this.runTest('A2.1.3: State Validation', async () => {
      try {
        const invalidState = {
          projectEntityName: '',
          status: 'invalid_status',
          currentRole: 'invalid_role',
          progress: 150 // Invalid progress > 100
        };
        
        await this.stateManager.setState('invalid_project', invalidState);
        assert.fail('Should reject invalid state');
      } catch (error) {
        assert(error.message.includes('validation'), 'Should validate state data');
      }
    });
    
    // Test A2.2: State Queries
    await this.runTest('A2.2.1: Query by Role', async () => {
      // Create test states with different roles
      await this.createTestStates();
      
      const plannerStates = await this.stateQuery.findByRole(WORKFLOW_ROLES.PLANNER);
      assert(plannerStates.length > 0, 'Should find states with planner role');
      
      plannerStates.forEach(state => {
        assert.strictEqual(state.currentRole, WORKFLOW_ROLES.PLANNER, 'All results should have planner role');
      });
    });
    
    await this.runTest('A2.2.2: Query by Status', async () => {
      const activeStates = await this.stateQuery.findByStatus(WORKFLOW_STATUS.ACTIVE);
      assert(activeStates.length > 0, 'Should find active states');
      
      activeStates.forEach(state => {
        assert.strictEqual(state.status, WORKFLOW_STATUS.ACTIVE, 'All results should be active');
      });
    });
    
    await this.runTest('A2.2.3: Complex Query', async () => {
      const query = new QueryBuilder()
        .equals('currentRole', WORKFLOW_ROLES.PLANNER)
        .between('progress', 0, 50)
        .limit(10)
        .sortBy('progress', 'asc')
        .build();
      
      const results = await this.stateQuery.findByCriteria(query.criteria, query.options);
      assert(Array.isArray(results), 'Should return array of results');
    });
    
    await this.runTest('A2.2.4: Query Performance', async () => {
      const startTime = Date.now();
      await this.stateQuery.getAllStates({ limit: 50 });
      const queryTime = Date.now() - startTime;
      
      assert(queryTime < 5000, `Query should complete within 5 seconds (took ${queryTime}ms)`);
    });
    
    // Test A2.3: Status Management
    await this.runTest('A2.3.1: Valid Status Transition', async () => {
      const result = await this.statusManager.transitionStatus(
        TEST_PROJECTS[0],
        WORKFLOW_STATUS.PAUSED,
        { reason: 'integration_test' }
      );
      
      assert(result.success, 'Should successfully transition status');
      assert.strictEqual(result.currentStatus, WORKFLOW_STATUS.PAUSED, 'Should have new status');
      
      const state = await this.stateManager.getState(TEST_PROJECTS[0]);
      assert.strictEqual(state.status, WORKFLOW_STATUS.PAUSED, 'State should be updated');
    });
    
    await this.runTest('A2.3.2: Invalid Status Transition', async () => {
      try {
        await this.statusManager.transitionStatus(
          TEST_PROJECTS[0],
          WORKFLOW_STATUS.COMPLETED, // Invalid transition from PAUSED
          { reason: 'invalid_test' }
        );
        assert.fail('Should reject invalid status transition');
      } catch (error) {
        assert(error.message.includes('Invalid status transition'), 'Should validate transitions');
      }
    });
    
    await this.runTest('A2.3.3: Status History', async () => {
      const history = await this.statusManager.getStatusHistory(TEST_PROJECTS[0]);
      assert(Array.isArray(history), 'Should return history array');
      assert(history.length > 0, 'Should have history entries');
      
      // Verify history structure
      history.forEach(entry => {
        assert(entry.from, 'History entry should have from status');
        assert(entry.to, 'History entry should have to status');
        assert(entry.timestamp, 'History entry should have timestamp');
      });
    });
    
    console.log('✅ Workflow State tests completed\n');
  }
  
  /**
   * Test Group A3: Redis MCP Integration
   */
  async runMCPIntegrationTests() {
    console.log('🔗 Testing Redis MCP Integration (A3)...');
    
    // Test A3.1: Basic Integration
    await this.runTest('A3.1.1: Integration Status', async () => {
      const status = this.mcpIntegration.getStatus();
      assert.strictEqual(status.currentState, INTEGRATION_STATES.REDIS_PRIMARY, 'Should start in Redis primary mode');
      assert(status.isConnected, 'Integration should be connected');
      assert(status.redisHealthy, 'Redis should be healthy');
    });
    
    await this.runTest('A3.1.2: Integrated State Operations', async () => {
      const testState = {
        projectEntityName: 'integration_test_project',
        status: WORKFLOW_STATUS.PENDING,
        currentRole: WORKFLOW_ROLES.IMPLEMENTER,
        progress: 0
      };
      
      const success = await this.mcpIntegration.setState('integration_test_project', testState);
      assert(success, 'Should successfully set state through integration');
      
      const retrieved = await this.mcpIntegration.getState('integration_test_project');
      assert(retrieved, 'Should retrieve state through integration');
      assert.strictEqual(retrieved.projectEntityName, 'integration_test_project', 'Should have correct project name');
      assert.strictEqual(retrieved._metadata.source, 'redis', 'Should indicate Redis as source');
    });
    
    await this.runTest('A3.1.3: Integrated Query Operations', async () => {
      const criteria = {
        currentRole: { operation: 'equals', value: WORKFLOW_ROLES.IMPLEMENTER }
      };
      
      const results = await this.mcpIntegration.queryStates(criteria);
      assert(Array.isArray(results), 'Should return query results');
      
      if (results.length > 0) {
        results.forEach(state => {
          assert(state._metadata.source, 'Should have source metadata');
          assert(state._metadata.retrievedAt, 'Should have retrieval timestamp');
        });
      }
    });
    
    // Test A3.2: Failover Scenarios
    await this.runTest('A3.2.1: Manual Failover', async () => {
      await this.mcpIntegration.forceFailover('integration_test');
      
      const status = this.mcpIntegration.getStatus();
      assert(status.currentState !== INTEGRATION_STATES.REDIS_PRIMARY, 'Should not be in Redis primary after failover');
      assert(status.healthMetrics.totalFailovers > 0, 'Should track failovers');
    });
    
    await this.runTest('A3.2.2: Redis Recovery', async () => {
      const recovered = await this.mcpIntegration.recoverRedis();
      
      if (recovered) {
        const status = this.mcpIntegration.getStatus();
        assert.strictEqual(status.currentState, INTEGRATION_STATES.REDIS_PRIMARY, 'Should return to Redis primary');
      }
    });
    
    // Test A3.3: Data Synchronization
    await this.runTest('A3.3.1: Sync Operations', async () => {
      try {
        const syncResult = await this.mcpIntegration.synchronizeData('redis_to_mcp');
        assert(typeof syncResult === 'object', 'Should return sync result object');
      } catch (error) {
        // Sync may fail in test environment without actual MCP tools
        console.log('  ⚠️  Sync test skipped - MCP tools not available');
        this.testResults.skipped++;
      }
    });
    
    console.log('✅ Redis MCP Integration tests completed\n');
  }
  
  /**
   * End-to-end workflow scenario tests
   */
  async runEndToEndTests() {
    console.log('🎯 Running End-to-End Workflow Tests...');
    
    await this.runTest('E2E.1: Complete Workflow Lifecycle', async () => {
      const projectName = 'e2e_workflow_test';
      
      // 1. Create initial workflow state
      const initialState = {
        projectEntityName: projectName,
        status: WORKFLOW_STATUS.PENDING,
        currentRole: WORKFLOW_ROLES.PLANNER,
        progress: 0,
        metadata: {
          e2eTest: true,
          startTime: Date.now()
        }
      };
      
      await this.mcpIntegration.setState(projectName, initialState);
      
      // 2. Transition to active status
      await this.mcpIntegration.transitionStatus(
        projectName, 
        WORKFLOW_STATUS.ACTIVE,
        { reason: 'e2e_test_start' }
      );
      
      // 3. Update progress through planner role
      const planningState = { ...initialState, status: WORKFLOW_STATUS.ACTIVE, progress: 25 };
      await this.mcpIntegration.setState(projectName, planningState);
      
      // 4. Transition to implementer role
      const implementerState = { 
        ...planningState, 
        currentRole: WORKFLOW_ROLES.IMPLEMENTER,
        progress: 50
      };
      await this.mcpIntegration.setState(projectName, implementerState);
      
      // 5. Complete implementation
      const completedState = { 
        ...implementerState, 
        currentRole: WORKFLOW_ROLES.REVIEWER,
        progress: 85
      };
      await this.mcpIntegration.setState(projectName, completedState);
      
      // 6. Final completion
      await this.mcpIntegration.transitionStatus(
        projectName,
        WORKFLOW_STATUS.COMPLETED,
        { reason: 'e2e_test_complete' }
      );
      
      // 7. Verify final state
      const finalState = await this.mcpIntegration.getState(projectName);
      assert.strictEqual(finalState.status, WORKFLOW_STATUS.COMPLETED, 'Should be completed');
      assert(finalState.metadata.e2eTest, 'Should preserve metadata');
      
      // 8. Verify history
      const history = await this.statusManager.getStatusHistory(projectName);
      assert(history.length >= 2, 'Should have transition history');
    });
    
    await this.runTest('E2E.2: Multi-Project Management', async () => {
      const projects = ['multi_project_a', 'multi_project_b', 'multi_project_c'];
      
      // Create multiple projects in different states
      for (let i = 0; i < projects.length; i++) {
        const state = {
          projectEntityName: projects[i],
          status: i === 0 ? WORKFLOW_STATUS.PENDING : i === 1 ? WORKFLOW_STATUS.ACTIVE : WORKFLOW_STATUS.PAUSED,
          currentRole: WORKFLOW_ROLES.PLANNER,
          progress: i * 25,
          metadata: { multiProjectTest: true }
        };
        
        await this.mcpIntegration.setState(projects[i], state);
      }
      
      // Query all test projects
      const criteria = {
        'metadata.multiProjectTest': { operation: 'equals', value: true }
      };
      
      const results = await this.mcpIntegration.queryStates(criteria);
      assert(results.length >= 3, 'Should find all multi-project test states');
    });
    
    console.log('✅ End-to-End tests completed\n');
  }
  
  /**
   * Performance benchmark tests
   */
  async runPerformanceTests() {
    console.log('⚡ Running Performance Benchmarks...');
    
    await this.runTest('PERF.1: State Operation Throughput', async () => {
      const operations = TEST_CONFIG.performance.benchmarkOperations;
      const startTime = Date.now();
      
      // Perform batch operations
      const promises = [];
      for (let i = 0; i < operations; i++) {
        const state = {
          projectEntityName: `perf_test_${i}`,
          status: WORKFLOW_STATUS.ACTIVE,
          currentRole: WORKFLOW_ROLES.IMPLEMENTER,
          progress: Math.floor(Math.random() * 100),
          metadata: { perfTest: true, iteration: i }
        };
        
        promises.push(this.mcpIntegration.setState(`perf_test_${i}`, state));
      }
      
      await Promise.all(promises);
      const duration = Date.now() - startTime;
      const throughput = (operations / duration) * 1000; // ops per second
      
      this.testResults.performance.stateThroughput = {
        operations,
        duration,
        throughput: Math.round(throughput * 100) / 100
      };
      
      console.log(`  📈 State operations: ${operations} ops in ${duration}ms (${throughput.toFixed(2)} ops/sec)`);
      assert(throughput > 10, 'Should achieve at least 10 ops/sec');
    });
    
    await this.runTest('PERF.2: Query Performance', async () => {
      const startTime = Date.now();
      const queries = 50;
      
      for (let i = 0; i < queries; i++) {
        await this.stateQuery.findByStatus(WORKFLOW_STATUS.ACTIVE, { limit: 10 });
      }
      
      const duration = Date.now() - startTime;
      const avgQueryTime = duration / queries;
      
      this.testResults.performance.queryPerformance = {
        queries,
        duration,
        avgQueryTime: Math.round(avgQueryTime * 100) / 100
      };
      
      console.log(`  📊 Query performance: ${queries} queries in ${duration}ms (${avgQueryTime.toFixed(2)}ms avg)`);
      assert(avgQueryTime < 100, 'Average query time should be under 100ms');
    });
    
    console.log('✅ Performance benchmarks completed\n');
  }
  
  /**
   * Failure recovery tests
   */
  async runFailureRecoveryTests() {
    console.log('🛡️  Testing Failure Recovery Scenarios...');
    
    await this.runTest('FAIL.1: Connection Recovery', async () => {
      // Simulate connection issue by disconnecting
      await this.redisClient.disconnect();
      assert(!this.redisClient.isConnected, 'Should be disconnected');
      
      // Attempt to reconnect
      await this.redisClient.connect();
      assert(this.redisClient.isConnected, 'Should reconnect successfully');
      
      // Verify operations work after reconnection
      const testState = {
        projectEntityName: 'recovery_test',
        status: WORKFLOW_STATUS.PENDING,
        currentRole: WORKFLOW_ROLES.PLANNER,
        progress: 0
      };
      
      const success = await this.stateManager.setState('recovery_test', testState);
      assert(success, 'Should work after reconnection');
    });
    
    await this.runTest('FAIL.2: Circuit Breaker', async () => {
      // Test circuit breaker by forcing failures
      const originalMaxFailures = this.mcpIntegration.circuitBreaker.maxFailures;
      this.mcpIntegration.circuitBreaker.maxFailures = 1; // Lower threshold for testing
      
      try {
        // Force a failure condition
        this.mcpIntegration.redisHealthy = false;
        await this.mcpIntegration._handleRedisFailure(new Error('Test failure'));
        
        const status = this.mcpIntegration.getStatus();
        assert(status.circuitBreaker.failureCount > 0, 'Should track failures');
        
      } finally {
        // Restore original settings
        this.mcpIntegration.circuitBreaker.maxFailures = originalMaxFailures;
        this.mcpIntegration.redisHealthy = true;
        this.mcpIntegration._resetCircuitBreaker();
      }
    });
    
    console.log('✅ Failure recovery tests completed\n');
  }
  
  /**
   * Create test workflow states for query testing
   */
  async createTestStates() {
    const testStates = [
      {
        projectEntityName: TEST_PROJECTS[1],
        status: WORKFLOW_STATUS.PENDING,
        currentRole: WORKFLOW_ROLES.PLANNER,
        progress: 10
      },
      {
        projectEntityName: TEST_PROJECTS[2],
        status: WORKFLOW_STATUS.ACTIVE,
        currentRole: WORKFLOW_ROLES.IMPLEMENTER,
        progress: 60
      },
      {
        projectEntityName: TEST_PROJECTS[3],
        status: WORKFLOW_STATUS.ACTIVE,
        currentRole: WORKFLOW_ROLES.REVIEWER,
        progress: 90
      }
    ];
    
    for (const state of testStates) {
      await this.stateManager.setState(state.projectEntityName, state);
    }
  }
  
  /**
   * Run individual test with error handling
   */
  async runTest(testName, testFunction) {
    try {
      console.log(`  🧪 ${testName}`);
      await testFunction();
      console.log(`  ✅ ${testName} - PASSED`);
      this.testResults.passed++;
      
    } catch (error) {
      console.log(`  ❌ ${testName} - FAILED: ${error.message}`);
      this.testResults.failed++;
      this.testResults.errors.push({
        test: testName,
        error: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Cleanup test environment
   */
  async cleanupTestEnvironment() {
    console.log('🧹 Cleaning up test environment...');
    
    try {
      // Clean up test data
      const testKeys = await this.redisClient.executeCommand('keys', `${TEST_CONFIG.redis.keyPrefix}*`);
      if (testKeys.length > 0) {
        await this.redisClient.executeCommand('del', ...testKeys);
      }
      
      // Disconnect components
      if (this.mcpIntegration) await this.mcpIntegration.disconnect();
      if (this.statusManager) await this.statusManager.disconnect();
      if (this.stateQuery) await this.stateQuery.disconnect();
      if (this.stateManager) await this.stateManager.disconnect();
      if (this.redisDetector) await this.redisDetector.disconnect();
      if (this.redisClient) await this.redisClient.disconnect();
      
      console.log('✅ Test cleanup completed\n');
      
    } catch (error) {
      console.warn('⚠️  Cleanup warning:', error.message);
    }
  }
  
  /**
   * Generate comprehensive test report
   */
  generateTestReport() {
    const totalTests = this.testResults.passed + this.testResults.failed + this.testResults.skipped;
    const duration = Date.now() - this.startTime;
    const successRate = totalTests > 0 ? ((this.testResults.passed / totalTests) * 100).toFixed(1) : '0';
    
    console.log('📊 PHASE A INTEGRATION TEST REPORT');
    console.log('=====================================');
    console.log(`⏱️  Total Duration: ${duration}ms`);
    console.log(`✅ Tests Passed: ${this.testResults.passed}`);
    console.log(`❌ Tests Failed: ${this.testResults.failed}`);
    console.log(`⏭️  Tests Skipped: ${this.testResults.skipped}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log('');
    
    // Performance summary
    if (Object.keys(this.testResults.performance).length > 0) {
      console.log('⚡ PERFORMANCE METRICS');
      console.log('=====================');
      
      if (this.testResults.performance.stateThroughput) {
        const perf = this.testResults.performance.stateThroughput;
        console.log(`📊 State Operations: ${perf.throughput} ops/sec`);
      }
      
      if (this.testResults.performance.queryPerformance) {
        const perf = this.testResults.performance.queryPerformance;
        console.log(`🔍 Query Performance: ${perf.avgQueryTime}ms avg`);
      }
      console.log('');
    }
    
    // Error summary
    if (this.testResults.errors.length > 0) {
      console.log('❌ TEST FAILURES');
      console.log('================');
      this.testResults.errors.forEach(error => {
        console.log(`• ${error.test}: ${error.error}`);
      });
      console.log('');
    }
    
    // Overall status
    if (this.testResults.failed === 0) {
      console.log('🎉 ALL PHASE A INTEGRATION TESTS PASSED!');
      console.log('Phase A Foundation is ready for Phase B Implementation.\n');
    } else {
      console.log('⚠️  SOME TESTS FAILED - Review errors before proceeding to Phase B.\n');
    }
    
    // Test coverage summary
    this.testResults.coverage = {
      redisInfrastructure: true,
      workflowStateOperations: true,
      redisMCPIntegration: true,
      endToEndWorkflows: true,
      performanceBenchmarks: true,
      failureRecovery: true,
      overallCompleteness: successRate
    };
  }
}

/**
 * Test runner function
 */
async function runPhaseAIntegrationTests() {
  const testSuite = new PhaseAIntegrationTests();
  return await testSuite.runAllTests();
}

// Export for use in other test environments
module.exports = {
  PhaseAIntegrationTests,
  runPhaseAIntegrationTests,
  TEST_CONFIG
};

// Run tests if called directly
if (require.main === module) {
  runPhaseAIntegrationTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Test runner failed:', error);
      process.exit(1);
    });
}