#!/usr/bin/env node

/**
 * TaskCoordinator Test Runner
 * 
 * @description Simple test runner to validate TaskCoordinator functionality
 * @version 1.0.0
 */

const path = require('path');
const { TaskCoordinator, QUEUE_TYPES, COORDINATION_STATES, RESOURCE_LIMITS } = require('./lib/task-coordinator');
const { TASK_PRIORITIES } = require('./lib/workflow-orchestrator');
const { createUseCaseConfig } = require('./config/redis-config');

// Simple assertion functions
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected: ${expected}, Actual: ${actual}`);
  }
}

function assertExists(value, message) {
  if (value === null || value === undefined) {
    throw new Error(`Assertion failed: ${message}. Value does not exist`);
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test suite
class TaskCoordinatorTestRunner {
  constructor() {
    this.testsPassed = 0;
    this.testsFailed = 0;
    this.coordinator = null;
  }

  async runAllTests() {
    console.log('🚀 TaskCoordinator Test Runner');
    console.log('==================================================\\n');

    try {
      // Setup
      await this.setup();
      
      // Run test suites
      await this.testInitialization();
      await this.testTaskQueueing();
      await this.testTaskStatus();
      await this.testTaskCommunication();
      await this.testResourceManagement();
      await this.testTaskDependencies();
      await this.testTaskCancellation();
      await this.testMetrics();
      await this.testErrorHandling();
      
      // Cleanup
      await this.cleanup();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      this.testsFailed++;
    }

    this.printResults();
  }

  async setup() {
    console.log('📋 Setting up test environment...');
    
    const testConfig = createUseCaseConfig('workflow', {
      maxQueueSize: 100,
      coordinationInterval: 100,
      resourceCheckInterval: 500,
      enableResourceMonitoring: true,
      enableTaskCommunication: true
    });
    
    this.coordinator = new TaskCoordinator(testConfig);
    await this.coordinator.initialize();
    
    console.log('✅ Test environment ready\\n');
  }

  async cleanup() {
    if (this.coordinator) {
      await this.coordinator.shutdown();
    }
    console.log('\\n🧹 Test environment cleaned up');
  }

  async testInitialization() {
    console.log('🧪 Testing Initialization...');
    
    try {
      // Test coordinator is initialized
      assert(this.coordinator.isInitialized, 'Coordinator should be initialized');
      
      // Test queue types are present
      const queueTypes = Array.from(this.coordinator.taskQueues.keys());
      assert(queueTypes.includes(QUEUE_TYPES.HIGH_PRIORITY), 'Should have high priority queue');
      assert(queueTypes.includes(QUEUE_TYPES.NORMAL_PRIORITY), 'Should have normal priority queue');
      assert(queueTypes.includes(QUEUE_TYPES.LOW_PRIORITY), 'Should have low priority queue');
      
      // Test resource tracking is initialized
      const resourceTypes = Array.from(this.coordinator.resourceUsage.keys());
      assert(resourceTypes.length > 0, 'Should have resource types initialized');
      
      console.log('✅ Initialization tests passed');
      this.testsPassed++;
      
    } catch (error) {
      console.log('❌ Initialization tests failed:', error.message);
      this.testsFailed++;
    }
  }

  async testTaskQueueing() {
    console.log('🧪 Testing Task Queueing...');
    
    try {
      // Test basic task queuing
      const taskDef = {
        id: 'test_task_1',
        type: 'test_task',
        priority: TASK_PRIORITIES.NORMAL,
        resources: { cpu: 10, memory: 512 }
      };
      
      const result = await this.coordinator.queueTask(taskDef);
      
      assertExists(result.taskId, 'Should return task ID');
      assertEqual(result.taskId, 'test_task_1', 'Should return correct task ID');
      assertExists(result.queueType, 'Should return queue type');
      assertEqual(result.queueType, QUEUE_TYPES.NORMAL_PRIORITY, 'Should be in normal priority queue');
      
      // Test priority handling
      const highPriorityTask = {
        id: 'high_task',
        type: 'test_task',
        priority: TASK_PRIORITIES.HIGH,
        resources: { cpu: 5 }
      };
      
      const highResult = await this.coordinator.queueTask(highPriorityTask);
      assertEqual(highResult.queueType, QUEUE_TYPES.HIGH_PRIORITY, 'High priority task should be in high priority queue');
      
      console.log('✅ Task queueing tests passed');
      this.testsPassed++;
      
    } catch (error) {
      console.log('❌ Task queueing tests failed:', error.message);
      this.testsFailed++;
    }
  }

  async testTaskStatus() {
    console.log('🧪 Testing Task Status...');
    
    try {
      const taskDef = {
        id: 'status_task',
        type: 'test_task',
        priority: TASK_PRIORITIES.NORMAL,
        resources: { cpu: 10 },
        dependencies: ['dep_task_1', 'dep_task_2']
      };
      
      await this.coordinator.queueTask(taskDef);
      const status = await this.coordinator.getTaskStatus('status_task');
      
      assertEqual(status.taskId, 'status_task', 'Should return correct task ID');
      assertEqual(status.state, COORDINATION_STATES.QUEUED, 'Task should be queued');
      assertEqual(status.priority, TASK_PRIORITIES.NORMAL, 'Should have correct priority');
      assert(Array.isArray(status.dependencies), 'Dependencies should be array');
      assertEqual(status.dependencies.length, 2, 'Should have correct number of dependencies');
      
      console.log('✅ Task status tests passed');
      this.testsPassed++;
      
    } catch (error) {
      console.log('❌ Task status tests failed:', error.message);
      this.testsFailed++;
    }
  }

  async testTaskCommunication() {
    console.log('🧪 Testing Task Communication...');
    
    try {
      const task1Def = { id: 'comm_task1', type: 'test_task' };
      const task2Def = { id: 'comm_task2', type: 'test_task' };
      
      await this.coordinator.queueTask(task1Def);
      await this.coordinator.queueTask(task2Def);
      
      const message = { type: 'test_message', content: 'Hello task2!' };
      const success = await this.coordinator.sendTaskMessage('comm_task2', message, 'comm_task1');
      
      assert(success, 'Message sending should succeed');
      
      const task2Status = await this.coordinator.getTaskStatus('comm_task2');
      assert(task2Status.messages.length > 0, 'Task should have received messages');
      assertEqual(task2Status.messages[0].from, 'comm_task1', 'Message should be from correct sender');
      assertEqual(task2Status.messages[0].to, 'comm_task2', 'Message should be to correct recipient');
      
      console.log('✅ Task communication tests passed');
      this.testsPassed++;
      
    } catch (error) {
      console.log('❌ Task communication tests failed:', error.message);
      this.testsFailed++;
    }
  }

  async testResourceManagement() {
    console.log('🧪 Testing Resource Management...');
    
    try {
      const taskDef = {
        id: 'resource_task',
        type: 'test_task',
        resources: { cpu: 25, memory: 1024 }
      };
      
      await this.coordinator.queueTask(taskDef);
      
      // Test resource allocation
      const task = this.coordinator.coordinatedTasks.get('resource_task');
      await this.coordinator._allocateResources(task);
      
      const metrics = this.coordinator.getMetrics();
      assert(metrics.activeAllocations > 0, 'Should have active allocations');
      
      // Test resource limit validation
      const heavyTask = {
        id: 'heavy_task',
        type: 'test_task',
        resources: { cpu: 200 } // Exceeds limit
      };
      
      let errorThrown = false;
      try {
        await this.coordinator.queueTask(heavyTask);
      } catch (error) {
        errorThrown = true;
        assert(error.message.includes('Insufficient resources'), 'Should throw resource error');
      }
      assert(errorThrown, 'Should throw error for insufficient resources');
      
      console.log('✅ Resource management tests passed');
      this.testsPassed++;
      
    } catch (error) {
      console.log('❌ Resource management tests failed:', error.message);
      this.testsFailed++;
    }
  }

  async testTaskDependencies() {
    console.log('🧪 Testing Task Dependencies...');
    
    try {
      // Create dependency task
      const depTaskDef = { id: 'dep_task', type: 'test_task' };
      await this.coordinator.queueTask(depTaskDef);
      
      // Create dependent task
      const dependentTaskDef = {
        id: 'dependent_task',
        type: 'test_task',
        dependencies: ['dep_task']
      };
      
      await this.coordinator.queueTask(dependentTaskDef);
      
      const dependentTask = this.coordinator.coordinatedTasks.get('dependent_task');
      const satisfied = this.coordinator._areDependenciesSatisfied(dependentTask);
      
      assert(!satisfied, 'Dependencies should not be satisfied initially');
      
      // Mark dependency as completed
      const depTask = this.coordinator.coordinatedTasks.get('dep_task');
      depTask.state = COORDINATION_STATES.COMPLETED;
      
      const nowSatisfied = this.coordinator._areDependenciesSatisfied(dependentTask);
      assert(nowSatisfied, 'Dependencies should be satisfied after completion');
      
      console.log('✅ Task dependencies tests passed');
      this.testsPassed++;
      
    } catch (error) {
      console.log('❌ Task dependencies tests failed:', error.message);
      this.testsFailed++;
    }
  }

  async testTaskCancellation() {
    console.log('🧪 Testing Task Cancellation...');
    
    try {
      const taskDef = { id: 'cancel_task', type: 'test_task' };
      await this.coordinator.queueTask(taskDef);
      
      const cancelled = await this.coordinator.cancelTask('cancel_task', 'user_request');
      assert(cancelled, 'Task cancellation should succeed');
      
      const status = await this.coordinator.getTaskStatus('cancel_task');
      assertEqual(status.state, COORDINATION_STATES.CANCELLED, 'Task should be cancelled');
      assertEqual(status.cancellationReason, 'user_request', 'Should have correct cancellation reason');
      
      console.log('✅ Task cancellation tests passed');
      this.testsPassed++;
      
    } catch (error) {
      console.log('❌ Task cancellation tests failed:', error.message);
      this.testsFailed++;
    }
  }

  async testMetrics() {
    console.log('🧪 Testing Metrics...');
    
    try {
      const metrics = this.coordinator.getMetrics();
      
      // Basic metrics
      assertExists(metrics.totalTasksCoordinated, 'Should have totalTasksCoordinated metric');
      assertExists(metrics.tasksInQueues, 'Should have tasksInQueues metric');
      assertExists(metrics.communicationEvents, 'Should have communicationEvents metric');
      
      // Queue utilization
      assertExists(metrics.queueUtilization, 'Should have queueUtilization metrics');
      assert(typeof metrics.queueUtilization === 'object', 'queueUtilization should be object');
      
      // Resource utilization
      assertExists(metrics.resourceUtilization, 'Should have resourceUtilization metrics');
      assert(typeof metrics.resourceUtilization === 'object', 'resourceUtilization should be object');
      
      // System state
      assertEqual(metrics.isInitialized, true, 'Should show initialized state');
      assertExists(metrics.settings, 'Should have settings in metrics');
      
      console.log('✅ Metrics tests passed');
      this.testsPassed++;
      
    } catch (error) {
      console.log('❌ Metrics tests failed:', error.message);
      this.testsFailed++;
    }
  }

  async testErrorHandling() {
    console.log('🧪 Testing Error Handling...');
    
    try {
      // Test invalid task definition
      let errorThrown = false;
      try {
        await this.coordinator.queueTask({ /* missing type */ });
      } catch (error) {
        errorThrown = true;
        assert(error.message.includes('Task type is required'), 'Should throw type validation error');
      }
      assert(errorThrown, 'Should throw error for invalid task definition');
      
      // Test invalid resource requirements
      errorThrown = false;
      try {
        await this.coordinator.queueTask({
          type: 'test_task',
          resources: { cpu: -10 }
        });
      } catch (error) {
        errorThrown = true;
        assert(error.message.includes('Invalid resource requirement'), 'Should throw resource validation error');
      }
      assert(errorThrown, 'Should throw error for invalid resources');
      
      // Test non-existent task status
      errorThrown = false;
      try {
        await this.coordinator.getTaskStatus('nonexistent_task');
      } catch (error) {
        errorThrown = true;
        assert(error.message.includes('Task not found'), 'Should throw task not found error');
      }
      assert(errorThrown, 'Should throw error for non-existent task');
      
      console.log('✅ Error handling tests passed');
      this.testsPassed++;
      
    } catch (error) {
      console.log('❌ Error handling tests failed:', error.message);
      this.testsFailed++;
    }
  }

  printResults() {
    console.log('\\n📊 Test Results Summary');
    console.log('==================================================');
    console.log(`📈 Total Tests: ${this.testsPassed + this.testsFailed}`);
    console.log(`✅ Passed: ${this.testsPassed}`);
    console.log(`❌ Failed: ${this.testsFailed}`);
    console.log(`📊 Success Rate: ${((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100).toFixed(1)}%`);
    
    if (this.testsFailed === 0) {
      console.log('🎉 All tests passed! TaskCoordinator is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new TaskCoordinatorTestRunner();
  runner.runAllTests().catch(error => {
    console.error('💥 Test runner failed:', error.message);
    process.exit(1);
  });
}

module.exports = TaskCoordinatorTestRunner;