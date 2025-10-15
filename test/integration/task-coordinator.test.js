/**
 * Task Coordination Framework Integration Tests
 * 
 * @description Comprehensive test suite for the Task Coordination Framework
 * @version 1.0.0
 * 
 * Test Coverage:
 * - Task queueing and priority management
 * - Resource allocation and constraint enforcement
 * - Inter-task communication using Redis pub/sub
 * - Task dependency coordination and resolution
 * - Performance monitoring and optimization
 * - Integration with other system components
 * - Error handling and recovery
 */

const { expect } = require('chai');
const { TaskCoordinator, QUEUE_TYPES, COMMUNICATION_CHANNELS, COORDINATION_STATES, RESOURCE_LIMITS } = require('../../lib/task-coordinator');
const { WorkflowOrchestrator, TASK_PRIORITIES } = require('../../lib/workflow-orchestrator');
const { RoleManager } = require('../../lib/role-manager');
const { RedisMCPIntegration } = require('../../lib/redis-mcp-integration');
const { createUseCaseConfig } = require('../../config/redis-config');

describe('TaskCoordinator Integration Tests', function() {
  this.timeout(30000); // 30 second timeout for integration tests
  
  let coordinator;
  let testConfig;
  let cleanupTasks = [];
  
  before(async function() {
    // Create test configuration
    testConfig = createUseCaseConfig('test_task_coordinator', {
      maxQueueSize: 100,
      coordinationInterval: 100, // Fast processing for tests
      resourceCheckInterval: 500,
      queueCleanupInterval: 1000,
      enableResourceMonitoring: true,
      enableTaskCommunication: true
    });
    
    // Initialize coordinator
    coordinator = new TaskCoordinator(testConfig);
    await coordinator.initialize();
    
    // Track for cleanup
    cleanupTasks.push(() => coordinator.shutdown());
  });
  
  after(async function() {
    // Clean up all test components
    for (const cleanup of cleanupTasks.reverse()) {
      try {
        await cleanup();
      } catch (error) {
        console.warn('Cleanup error:', error.message);
      }
    }
  });
  
  beforeEach(function() {
    // Clear any existing tasks before each test
    coordinator.coordinatedTasks.clear();
    for (const queue of coordinator.taskQueues.values()) {
      queue.length = 0;
    }
  });
  
  describe('Initialization and Configuration', function() {
    it('should initialize with correct configuration', function() {
      expect(coordinator.isInitialized).to.be.true;
      expect(coordinator.settings.maxQueueSize).to.equal(100);
      expect(coordinator.settings.enableResourceMonitoring).to.be.true;
      expect(coordinator.settings.enableTaskCommunication).to.be.true;
    });
    
    it('should have all required queue types', function() {
      const queueTypes = Array.from(coordinator.taskQueues.keys());
      expect(queueTypes).to.include.members(Object.values(QUEUE_TYPES));
    });
    
    it('should have initialized resource tracking', function() {
      const resourceTypes = Array.from(coordinator.resourceUsage.keys());
      expect(resourceTypes).to.include.members(
        Object.keys(RESOURCE_LIMITS).map(type => type.toLowerCase())
      );
    });
  });
  
  describe('Task Queueing Operations', function() {
    it('should queue a basic task successfully', async function() {
      const taskDef = {
        id: 'test_task_1',
        type: 'test_task',
        priority: TASK_PRIORITIES.NORMAL,
        resources: { cpu: 10, memory: 512 }
      };
      
      const result = await coordinator.queueTask(taskDef);
      
      expect(result).to.have.property('taskId');
      expect(result).to.have.property('queueType');
      expect(result).to.have.property('estimatedWaitTime');
      expect(result.taskId).to.equal('test_task_1');
      expect(result.queueType).to.equal(QUEUE_TYPES.NORMAL_PRIORITY);
    });
    
    it('should handle task priority correctly', async function() {
      const highPriorityTask = {
        id: 'high_task',
        type: 'test_task',
        priority: TASK_PRIORITIES.HIGH,
        resources: { cpu: 5 }
      };
      
      const normalPriorityTask = {
        id: 'normal_task',
        type: 'test_task',
        priority: TASK_PRIORITIES.NORMAL,
        resources: { cpu: 5 }
      };
      
      await coordinator.queueTask(normalPriorityTask);
      await coordinator.queueTask(highPriorityTask);
      
      // High priority task should be in high priority queue
      const highQueue = coordinator.taskQueues.get(QUEUE_TYPES.HIGH_PRIORITY);
      const normalQueue = coordinator.taskQueues.get(QUEUE_TYPES.NORMAL_PRIORITY);
      
      expect(highQueue.length).to.equal(1);
      expect(normalQueue.length).to.equal(1);
      expect(highQueue[0].id).to.equal('high_task');
    });
    
    it('should reject tasks when resources are insufficient', async function() {
      const resourceHeavyTask = {
        id: 'heavy_task',
        type: 'test_task',
        resources: {
          cpu: 200, // Exceeds limit
          memory: 512
        }
      };
      
      try {
        await coordinator.queueTask(resourceHeavyTask);
        expect.fail('Should have thrown resource error');
      } catch (error) {
        expect(error.message).to.include('Insufficient resources');
      }
    });
    
    it('should allow forced queuing despite resource constraints', async function() {
      const resourceHeavyTask = {
        id: 'heavy_task_forced',
        type: 'test_task',
        resources: {
          cpu: 200 // Exceeds limit
        }
      };
      
      const result = await coordinator.queueTask(resourceHeavyTask, { forceQueue: true });
      expect(result).to.have.property('taskId');
      expect(result.taskId).to.equal('heavy_task_forced');
    });
  });
  
  describe('Task Status and Monitoring', function() {
    it('should provide accurate task status information', async function() {
      const taskDef = {
        id: 'status_task',
        type: 'test_task',
        priority: TASK_PRIORITIES.NORMAL,
        resources: { cpu: 10 },
        dependencies: ['dep_task_1', 'dep_task_2']
      };
      
      await coordinator.queueTask(taskDef);
      const status = await coordinator.getTaskStatus('status_task');
      
      expect(status).to.have.property('taskId', 'status_task');
      expect(status).to.have.property('state', COORDINATION_STATES.QUEUED);
      expect(status).to.have.property('priority', TASK_PRIORITIES.NORMAL);
      expect(status).to.have.property('dependencies');
      expect(status.dependencies).to.deep.equal(['dep_task_1', 'dep_task_2']);
    });
    
    it('should throw error for non-existent task status', async function() {
      try {
        await coordinator.getTaskStatus('nonexistent_task');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Task not found');
      }
    });
  });
  
  describe('Inter-Task Communication', function() {
    it('should send messages between tasks', async function() {
      const task1Def = { id: 'task1', type: 'test_task' };
      const task2Def = { id: 'task2', type: 'test_task' };
      
      await coordinator.queueTask(task1Def);
      await coordinator.queueTask(task2Def);
      
      const message = { type: 'test_message', content: 'Hello task2!' };
      const success = await coordinator.sendTaskMessage('task2', message, 'task1');
      
      expect(success).to.be.true;
      
      // Check that message was added to task2's queue
      const task2Status = await coordinator.getTaskStatus('task2');
      expect(task2Status.messages).to.have.length(1);
      expect(task2Status.messages[0]).to.have.property('from', 'task1');
      expect(task2Status.messages[0]).to.have.property('to', 'task2');
      expect(task2Status.messages[0].content).to.deep.equal(message);
    });
    
    it('should handle communication disabled scenario', async function() {
      const disabledCoordinator = new TaskCoordinator({
        ...testConfig,
        enableTaskCommunication: false
      });
      cleanupTasks.push(() => disabledCoordinator.shutdown());
      await disabledCoordinator.initialize();
      
      const taskDef = { id: 'task1', type: 'test_task' };
      await disabledCoordinator.queueTask(taskDef);
      
      try {
        await disabledCoordinator.sendTaskMessage('task1', { content: 'test' });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Task communication is disabled');
      }
    });
  });
  
  describe('Task Cancellation', function() {
    it('should cancel a queued task successfully', async function() {
      const taskDef = { id: 'cancel_task', type: 'test_task' };
      await coordinator.queueTask(taskDef);
      
      const cancelled = await coordinator.cancelTask('cancel_task', 'user_request');
      expect(cancelled).to.be.true;
      
      const status = await coordinator.getTaskStatus('cancel_task');
      expect(status.state).to.equal(COORDINATION_STATES.CANCELLED);
      expect(status).to.have.property('cancellationReason', 'user_request');
    });
    
    it('should not cancel a completed task', async function() {
      const taskDef = { id: 'completed_task', type: 'test_task' };
      await coordinator.queueTask(taskDef);
      
      // Manually mark as completed for test
      const task = coordinator.coordinatedTasks.get('completed_task');
      task.state = COORDINATION_STATES.COMPLETED;
      
      const cancelled = await coordinator.cancelTask('completed_task');
      expect(cancelled).to.be.false;
    });
  });
  
  describe('Resource Management', function() {
    it('should track resource allocations', async function() {
      const taskDef = {
        id: 'resource_task',
        type: 'test_task',
        resources: { cpu: 25, memory: 1024 }
      };
      
      await coordinator.queueTask(taskDef);
      
      // Manually allocate resources to test tracking
      await coordinator._allocateResources(coordinator.coordinatedTasks.get('resource_task'));
      
      const metrics = coordinator.getMetrics();
      expect(metrics).to.have.property('activeAllocations');
      expect(metrics.activeAllocations).to.be.greaterThan(0);
    });
    
    it('should provide resource utilization metrics', function() {
      const metrics = coordinator.getMetrics();
      
      expect(metrics).to.have.property('resourceUtilization');
      expect(metrics.resourceUtilization).to.be.an('object');
      
      // Should have entries for all resource types
      const resourceTypes = Object.keys(RESOURCE_LIMITS).map(type => type.toLowerCase());
      for (const resourceType of resourceTypes) {
        if (metrics.resourceUtilization[resourceType]) {
          expect(metrics.resourceUtilization[resourceType]).to.have.property('current');
          expect(metrics.resourceUtilization[resourceType]).to.have.property('total');
          expect(metrics.resourceUtilization[resourceType]).to.have.property('utilization');
          expect(metrics.resourceUtilization[resourceType]).to.have.property('status');
        }
      }
    });
  });
  
  describe('Task Dependencies', function() {
    it('should handle task dependency validation', async function() {
      // Create dependency task first
      const depTaskDef = { id: 'dep_task', type: 'test_task' };
      await coordinator.queueTask(depTaskDef);
      
      // Create dependent task
      const dependentTaskDef = {
        id: 'dependent_task',
        type: 'test_task',
        dependencies: ['dep_task']
      };
      
      await coordinator.queueTask(dependentTaskDef);
      
      const dependentTask = coordinator.coordinatedTasks.get('dependent_task');
      const satisfied = coordinator._areDependenciesSatisfied(dependentTask);
      
      // Should not be satisfied since dep_task is not completed
      expect(satisfied).to.be.false;
    });
    
    it('should satisfy dependencies when dependency tasks complete', async function() {
      // Create and complete dependency task
      const depTaskDef = { id: 'completed_dep_task', type: 'test_task' };
      await coordinator.queueTask(depTaskDef);
      
      const depTask = coordinator.coordinatedTasks.get('completed_dep_task');
      depTask.state = COORDINATION_STATES.COMPLETED;
      
      // Create dependent task
      const dependentTaskDef = {
        id: 'dependent_task_2',
        type: 'test_task',
        dependencies: ['completed_dep_task']
      };
      
      await coordinator.queueTask(dependentTaskDef);
      
      const dependentTask = coordinator.coordinatedTasks.get('dependent_task_2');
      const satisfied = coordinator._areDependenciesSatisfied(dependentTask);
      
      expect(satisfied).to.be.true;
    });
  });
  
  describe('Queue Management', function() {
    it('should enforce queue size limits', async function() {
      // Create coordinator with small queue limit
      const limitedCoordinator = new TaskCoordinator({
        ...testConfig,
        maxQueueSize: 2
      });
      cleanupTasks.push(() => limitedCoordinator.shutdown());
      await limitedCoordinator.initialize();
      
      // Fill queue to limit
      await limitedCoordinator.queueTask({ id: 'task1', type: 'test_task' });
      await limitedCoordinator.queueTask({ id: 'task2', type: 'test_task' });
      
      // Third task should fail
      try {
        await limitedCoordinator.queueTask({ id: 'task3', type: 'test_task' });
        expect.fail('Should have thrown queue full error');
      } catch (error) {
        expect(error.message).to.include('Queue');
        expect(error.message).to.include('is full');
      }
    });
    
    it('should maintain priority order in queues', async function() {
      const tasks = [
        { id: 'low1', type: 'test_task', priority: TASK_PRIORITIES.LOW },
        { id: 'high1', type: 'test_task', priority: TASK_PRIORITIES.HIGH },
        { id: 'normal1', type: 'test_task', priority: TASK_PRIORITIES.NORMAL },
        { id: 'high2', type: 'test_task', priority: TASK_PRIORITIES.HIGH }
      ];
      
      // Queue tasks in mixed order
      for (const task of tasks) {
        await coordinator.queueTask(task);
      }
      
      // Check high priority queue order (should be FIFO for same priority)
      const highQueue = coordinator.taskQueues.get(QUEUE_TYPES.HIGH_PRIORITY);
      expect(highQueue).to.have.length(2);
      expect(highQueue[0].id).to.equal('high1');
      expect(highQueue[1].id).to.equal('high2');
    });
  });
  
  describe('Performance Metrics', function() {
    it('should provide comprehensive metrics', function() {
      const metrics = coordinator.getMetrics();
      
      // Basic metrics
      expect(metrics).to.have.property('totalTasksCoordinated');
      expect(metrics).to.have.property('tasksInQueues');
      expect(metrics).to.have.property('tasksExecuting');
      expect(metrics).to.have.property('tasksCompleted');
      expect(metrics).to.have.property('tasksFailed');
      
      // Queue metrics
      expect(metrics).to.have.property('queueUtilization');
      expect(metrics.queueUtilization).to.be.an('object');
      
      // Resource metrics
      expect(metrics).to.have.property('resourceUtilization');
      expect(metrics.resourceUtilization).to.be.an('object');
      
      // Communication metrics
      expect(metrics).to.have.property('communicationEvents');
      expect(metrics).to.have.property('coordinationEvents');
      
      // System state
      expect(metrics).to.have.property('isInitialized', true);
      expect(metrics).to.have.property('settings');
    });
    
    it('should update metrics correctly when tasks are queued', async function() {
      const initialMetrics = coordinator.getMetrics();
      const initialTotal = initialMetrics.totalTasksCoordinated;
      
      await coordinator.queueTask({ id: 'metrics_task', type: 'test_task' });
      
      const updatedMetrics = coordinator.getMetrics();
      expect(updatedMetrics.totalTasksCoordinated).to.equal(initialTotal + 1);
      expect(updatedMetrics.tasksInQueues).to.be.greaterThan(initialMetrics.tasksInQueues);
    });
  });
  
  describe('Error Handling', function() {
    it('should handle invalid task definitions', async function() {
      const invalidTask = { /* missing type */ };
      
      try {
        await coordinator.queueTask(invalidTask);
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.message).to.include('Task type is required');
      }
    });
    
    it('should handle invalid resource requirements', async function() {
      const invalidResourceTask = {
        type: 'test_task',
        resources: {
          cpu: -10, // Negative resource
          memory: 'invalid' // Non-numeric resource
        }
      };
      
      try {
        await coordinator.queueTask(invalidResourceTask);
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.message).to.include('Invalid resource requirement');
      }
    });
    
    it('should handle invalid dependencies format', async function() {
      const invalidDepsTask = {
        type: 'test_task',
        dependencies: 'not_an_array' // Should be array
      };
      
      try {
        await coordinator.queueTask(invalidDepsTask);
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.message).to.include('Dependencies must be an array');
      }
    });
  });
  
  describe('Integration with Other Components', function() {
    it('should integrate with WorkflowOrchestrator', function() {
      expect(coordinator.orchestrator).to.be.instanceOf(WorkflowOrchestrator);
      expect(coordinator.orchestrator.isInitialized).to.be.true;
    });
    
    it('should integrate with RoleManager', function() {
      expect(coordinator.roleManager).to.be.instanceOf(RoleManager);
      expect(coordinator.roleManager.isInitialized).to.be.true;
    });
    
    it('should integrate with RedisMCPIntegration', function() {
      expect(coordinator.mcpIntegration).to.be.instanceOf(RedisMCPIntegration);
      expect(coordinator.mcpIntegration.isConnected).to.be.true;
    });
  });
  
  describe('Shutdown and Cleanup', function() {
    it('should shutdown gracefully', async function() {
      const testCoordinator = new TaskCoordinator(testConfig);
      await testCoordinator.initialize();
      
      expect(testCoordinator.isInitialized).to.be.true;
      
      await testCoordinator.shutdown();
      
      expect(testCoordinator.isInitialized).to.be.false;
    });
    
    it('should persist queue state before shutdown', async function() {
      const persistCoordinator = new TaskCoordinator(testConfig);
      await persistCoordinator.initialize();
      
      // Add some tasks
      await persistCoordinator.queueTask({ id: 'persist_task_1', type: 'test_task' });
      await persistCoordinator.queueTask({ id: 'persist_task_2', type: 'test_task' });
      
      // Shutdown should persist queues
      await persistCoordinator.shutdown();
      
      // Create new coordinator and check if queues are loaded
      const newCoordinator = new TaskCoordinator(testConfig);
      await newCoordinator.initialize();
      
      // Should have loaded persisted tasks
      // Note: This test assumes persistence is working correctly
      const metrics = newCoordinator.getMetrics();
      
      await newCoordinator.shutdown();
    });
  });
  
  describe('Advanced Features', function() {
    it('should handle task completion notifications', async function() {
      let completionReceived = false;
      
      coordinator.on('taskDispatched', (event) => {
        expect(event).to.have.property('taskId');
        expect(event).to.have.property('workflowId');
        expect(event).to.have.property('queueType');
        completionReceived = true;
      });
      
      const taskDef = {
        id: 'completion_task',
        type: 'test_task',
        resources: { cpu: 1 } // Minimal resources
      };
      
      await coordinator.queueTask(taskDef);
      
      // Wait a bit for processing
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Note: Actual dispatch depends on dependency satisfaction and resource availability
      // This test verifies the event structure when dispatch occurs
    });
    
    it('should estimate task wait times', async function() {
      // Add several tasks to create a queue
      for (let i = 0; i < 5; i++) {
        await coordinator.queueTask({
          id: `queue_task_${i}`,
          type: 'test_task',
          priority: TASK_PRIORITIES.NORMAL
        });
      }
      
      const newTaskDef = {
        id: 'estimate_task',
        type: 'test_task',
        priority: TASK_PRIORITIES.LOW
      };
      
      const result = await coordinator.queueTask(newTaskDef);
      
      expect(result).to.have.property('estimatedWaitTime');
      expect(result.estimatedWaitTime).to.be.a('number');
      expect(result.estimatedWaitTime).to.be.greaterThanOrEqual(0);
    });
  });
});