# Task Coordination Framework (B1.3)

## Overview

The Task Coordination Framework provides advanced task queuing, priority management, resource allocation, and inter-task communication for the Agent OS. This is the third component in Phase B Task Group 1 (Core Orchestration Foundation).

## Architecture

### Design Patterns Implemented

- **Producer-Consumer Pattern**: Task queue management
- **Mediator Pattern**: Inter-task communication
- **Strategy Pattern**: Resource allocation approaches  
- **Observer Pattern**: Coordination events
- **Command Pattern**: Task operations

### Core Components

1. **TaskCoordinator**: Main coordination class
2. **Task Queues**: Priority-based task queuing system
3. **Resource Manager**: Resource allocation and constraint management
4. **Communication System**: Inter-task messaging via Redis pub/sub
5. **Dependency Manager**: Task dependency coordination
6. **Metrics System**: Performance monitoring and optimization

## Features

### Task Queuing System
- **Multiple Queue Types**: 
  - High Priority
  - Normal Priority  
  - Low Priority
  - Background
  - Retry
  - Dead Letter
- **Priority-based Scheduling**: Tasks processed by priority
- **Queue Size Limits**: Configurable maximum queue sizes
- **Redis Persistence**: Queue state persisted for recovery

### Resource Management
- **Resource Types**:
  - CPU (0-100%)
  - Memory (MB)
  - Network (Mbps)
  - Storage (GB)
  - Agent Slots
  - Concurrent Tasks
- **Resource Limits**: Warning and critical thresholds
- **Resource Allocation**: Track and manage resource assignments
- **Resource Constraints**: Prevent over-allocation

### Inter-Task Communication
- **Message Channels**: Redis pub/sub based messaging
- **Message Types**: Structured message format
- **Message Queues**: Per-task message queues
- **Event Notifications**: Dependency and status events

### Task Dependencies
- **Dependency Graph**: Track task relationships
- **Dependency Validation**: Ensure prerequisites are met
- **Dependency Notifications**: Alert dependent tasks of changes

## API Reference

### TaskCoordinator Class

#### Constructor
```javascript
new TaskCoordinator(config)
```

#### Methods

##### `initialize()`
Initialize the task coordinator and all subsystems.

##### `queueTask(taskDefinition, options)`
Queue a task for coordination and execution.

**Parameters:**
- `taskDefinition`: Task definition object
- `options`: Queuing options (optional)

**Returns:** Task coordination result with ID, queue type, and estimated wait time

##### `getTaskStatus(taskId)`
Get comprehensive status information for a task.

**Returns:** Task status including state, position, resources, dependencies, and messages

##### `sendTaskMessage(taskId, message, fromTaskId)`
Send a message to another task.

**Parameters:**
- `taskId`: Target task ID
- `message`: Message content
- `fromTaskId`: Source task ID (optional)

##### `cancelTask(taskId, reason)`
Cancel a queued or executing task.

**Returns:** Boolean indicating cancellation success

##### `getMetrics()`
Get comprehensive coordination metrics and statistics.

##### `shutdown()`
Gracefully shutdown the task coordinator.

## Configuration

### Basic Configuration
```javascript
const config = {
  maxQueueSize: 10000,
  maxRetries: 3,
  retryDelay: 5000,
  allocationStrategy: 'priority',
  enableResourceMonitoring: true,
  enableTaskCommunication: true,
  coordinationInterval: 1000,
  resourceCheckInterval: 5000,
  queueCleanupInterval: 60000
}
```

### Resource Allocation Strategies
- `fifo`: First In, First Out
- `priority`: Priority-based allocation
- `fair_share`: Fair resource distribution  
- `weighted`: Weighted by task importance
- `deadline`: Deadline-driven allocation
- `adaptive`: ML/AI-driven adaptive allocation

## Task Definition Format

```javascript
const taskDefinition = {
  id: 'unique_task_id',
  type: 'task_type',
  priority: TASK_PRIORITIES.NORMAL,
  resources: {
    cpu: 25,
    memory: 1024,
    network: 100
  },
  dependencies: ['dependency_task_id'],
  metadata: {
    description: 'Task description',
    timeout: 300000,
    retryOnFailure: true
  }
}
```

## Coordination States

- `QUEUED`: Task is waiting in queue
- `ALLOCATED`: Resources have been allocated
- `DISPATCHED`: Task sent to orchestrator
- `EXECUTING`: Task is currently running
- `COORDINATING`: Coordinating with other tasks
- `COMPLETED`: Task finished successfully
- `FAILED`: Task execution failed
- `CANCELLED`: Task was cancelled

## Integration Points

### With Workflow Orchestrator (B1.1)
- Tasks dispatched to orchestrator for execution
- Workflow definitions created for coordinated tasks
- Status updates received from orchestrator

### With Role Manager (B1.2)
- Role-based task assignment
- Permission validation for task operations
- Role transitions during task execution

### With Redis Infrastructure
- Queue persistence and recovery
- Inter-task communication via pub/sub
- Resource state management

## Performance Monitoring

### Metrics Tracked
- Total tasks coordinated
- Tasks in queues vs executing vs completed
- Average queue and execution times
- Resource utilization by type
- Communication events
- Queue utilization by type
- Success/failure rates

### Health Monitoring
- Resource constraint violations
- Queue overflow conditions
- Communication system health
- Integration component status

## Error Handling

### Validation Errors
- Invalid task definitions
- Missing required fields
- Invalid resource requirements
- Malformed dependencies

### Resource Errors  
- Insufficient resources
- Resource allocation failures
- Resource constraint violations

### Communication Errors
- Message delivery failures
- Channel setup errors
- Pub/sub connectivity issues

### Recovery Mechanisms
- Automatic retry for transient failures
- Dead letter queue for failed tasks
- Circuit breaker for persistent failures
- Graceful fallback to alternate strategies

## Examples

### Basic Task Coordination
```javascript
const coordinator = new TaskCoordinator(config);
await coordinator.initialize();

// Queue a task
const result = await coordinator.queueTask({
  id: 'data_processing_task',
  type: 'data_processing',
  priority: TASK_PRIORITIES.HIGH,
  resources: { cpu: 50, memory: 2048 }
});

console.log(`Task ${result.taskId} queued in ${result.queueType}`);
console.log(`Estimated wait time: ${result.estimatedWaitTime}ms`);
```

### Task Communication
```javascript
// Send message between tasks
await coordinator.sendTaskMessage(
  'target_task_id', 
  { 
    type: 'data_ready',
    payload: { dataLocation: '/tmp/processed_data.json' }
  },
  'source_task_id'
);
```

### Resource Monitoring
```javascript
const metrics = coordinator.getMetrics();
console.log('Resource Utilization:', metrics.resourceUtilization);
console.log('Queue Status:', metrics.queueUtilization);
console.log('Active Tasks:', metrics.tasksExecuting);
```

## Testing

The framework includes comprehensive test coverage:

- **Initialization Tests**: Component startup and configuration
- **Task Queueing Tests**: Queue operations and priority handling
- **Resource Management Tests**: Allocation and constraint validation
- **Communication Tests**: Inter-task messaging
- **Dependency Tests**: Dependency resolution and coordination
- **Error Handling Tests**: Validation and failure scenarios
- **Integration Tests**: Component interaction verification

## Future Enhancements

### Planned Features
- **Adaptive Resource Allocation**: ML-driven resource optimization
- **Advanced Scheduling**: Deadline-aware task scheduling
- **Load Balancing**: Distribute tasks across multiple coordinators
- **Task Checkpointing**: Save and restore task execution state
- **Performance Analytics**: Advanced metrics and optimization insights

### Scalability Improvements
- **Distributed Coordination**: Multi-node task coordination
- **Horizontal Scaling**: Auto-scaling based on queue depth
- **Federation**: Coordinate across multiple Agent OS instances
- **Stream Processing**: Real-time task stream coordination

This completes the Task Coordination Framework (B1.3) implementation, providing a robust foundation for advanced task orchestration and coordination within the Agent OS architecture.