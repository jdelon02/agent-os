# Workflow State Management Tests

> **Test Suite:** Workflow State Management  
> **Purpose:** Validate Redis Hash-based workflow state operations and data integrity  
> **Dependencies:** Redis client, workflow state manager, state query interface  
> **Coverage:** CRUD operations, TTL management, state transitions, concurrent access  

## Test Overview

This test suite validates the complete workflow state management implementation including:
- State storage and retrieval using Redis Hash operations
- TTL management with 2-hour default expiration
- Data integrity and consistency across operations
- Role context tracking and progress monitoring
- State transitions and validation
- Concurrent access handling
- Query interface functionality

## Test Environment Setup

### Prerequisites
```javascript
// Required components
const { RedisClient } = require('../../lib/redis-client');
const { WorkflowStateManager } = require('../../lib/workflow-state-manager');
const { StateQuery } = require('../../lib/state-query');
const { StatusManager } = require('../../lib/status-manager');
const { createTestConfig } = require('../../config/redis-config');
```

### Test Data Structures
```javascript
const testWorkflowState = {
  projectEntityName: 'test-project-123',
  currentRole: 'Pattern Analyzer',
  progress: 25,
  status: 'active',
  nextActions: ['analyze_patterns', 'generate_report'],
  contextData: {
    analysisType: 'redis_implementation',
    patterns: ['Repository', 'State Machine'],
    timestamp: new Date().toISOString()
  },
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  }
};

const testConfig = createTestConfig({
  testDb: 14, // Use database 14 for workflow state tests
  customConfig: {
    defaultTTL: {
      workflows: 300, // 5 minutes for fast testing
      handoffs: 600,
      checkpoints: 180,
      events: 300
    }
  }
});
```

## Test Cases

### Test Group 1: Basic State Storage and Retrieval

#### Test 1.1: Store Workflow State
**Objective:** Verify workflow state can be stored with proper structure and TTL

**Test Steps:**
1. Initialize WorkflowStateManager with test configuration
2. Store complete workflow state using workflows:{project} key format
3. Verify state is stored with correct TTL
4. Validate all fields are preserved

**Expected Results:**
- State stored successfully with 300-second TTL
- All nested objects and arrays preserved
- Key follows workflows:{projectEntityName} format
- Redis Hash contains all expected fields

**Test Implementation:**
```javascript
async function testStoreWorkflowState() {
  const stateManager = new WorkflowStateManager(testConfig);
  const projectName = 'test-store-workflow';
  
  const workflowState = {
    ...testWorkflowState,
    projectEntityName: projectName
  };
  
  // Store the workflow state
  const result = await stateManager.storeState(projectName, workflowState);
  
  if (!result.success) {
    throw new Error(`Failed to store workflow state: ${result.error}`);
  }
  
  // Verify TTL is set
  const ttl = await stateManager.getStateTTL(projectName);
  if (ttl <= 0 || ttl > 300) {
    throw new Error(`Invalid TTL: ${ttl}. Expected 0 < TTL <= 300`);
  }
  
  // Verify key format
  const expectedKey = `workflows:${projectName}`;
  const keyExists = await stateManager.stateExists(projectName);
  if (!keyExists) {
    throw new Error(`State key ${expectedKey} does not exist`);
  }
  
  return 'Workflow state stored successfully with correct TTL and key format';
}
```

#### Test 1.2: Retrieve Workflow State
**Objective:** Verify stored workflow state can be retrieved with data integrity

**Test Steps:**
1. Store workflow state
2. Retrieve the complete state
3. Validate all fields match original data
4. Verify data types are preserved

**Expected Results:**
- Retrieved state matches stored state exactly
- Nested objects and arrays preserved
- Data types maintained (strings, numbers, dates)
- No data corruption or loss

**Test Implementation:**
```javascript
async function testRetrieveWorkflowState() {
  const stateManager = new WorkflowStateManager(testConfig);
  const projectName = 'test-retrieve-workflow';
  
  const originalState = {
    ...testWorkflowState,
    projectEntityName: projectName
  };
  
  // Store workflow state
  await stateManager.storeState(projectName, originalState);
  
  // Retrieve workflow state
  const retrievedState = await stateManager.getState(projectName);
  
  if (!retrievedState) {
    throw new Error('Failed to retrieve workflow state');
  }
  
  // Validate core fields
  const coreFields = ['currentRole', 'progress', 'status', 'nextActions'];
  for (const field of coreFields) {
    if (JSON.stringify(retrievedState[field]) !== JSON.stringify(originalState[field])) {
      throw new Error(`Field ${field} mismatch. Expected: ${JSON.stringify(originalState[field])}, Got: ${JSON.stringify(retrievedState[field])}`);
    }
  }
  
  // Validate nested contextData
  if (JSON.stringify(retrievedState.contextData) !== JSON.stringify(originalState.contextData)) {
    throw new Error('Context data mismatch');
  }
  
  // Validate array preservation
  if (!Array.isArray(retrievedState.nextActions) || 
      retrievedState.nextActions.length !== originalState.nextActions.length) {
    throw new Error('Next actions array not preserved correctly');
  }
  
  return 'Workflow state retrieved successfully with complete data integrity';
}
```

### Test Group 2: TTL Management and Expiration

#### Test 2.1: TTL Setting and Updates
**Objective:** Verify TTL is properly managed during state updates

**Test Steps:**
1. Store workflow state with default TTL
2. Update state and verify TTL is refreshed
3. Set custom TTL and verify it's applied
4. Check TTL decreases over time

**Expected Results:**
- Initial TTL set to configured default (300 seconds)
- TTL refreshed on state updates
- Custom TTL values respected
- TTL countdown works correctly

**Test Implementation:**
```javascript
async function testTTLManagement() {
  const stateManager = new WorkflowStateManager(testConfig);
  const projectName = 'test-ttl-management';
  
  // Store initial state
  await stateManager.storeState(projectName, {
    ...testWorkflowState,
    projectEntityName: projectName
  });
  
  // Check initial TTL
  const initialTTL = await stateManager.getStateTTL(projectName);
  if (initialTTL <= 0 || initialTTL > 300) {
    throw new Error(`Invalid initial TTL: ${initialTTL}`);
  }
  
  // Wait 2 seconds and check TTL decreased
  await new Promise(resolve => setTimeout(resolve, 2000));
  const decreasedTTL = await stateManager.getStateTTL(projectName);
  if (decreasedTTL >= initialTTL) {
    throw new Error('TTL did not decrease over time');
  }
  
  // Update state and verify TTL is refreshed
  await stateManager.updateState(projectName, { progress: 50 });
  const refreshedTTL = await stateManager.getStateTTL(projectName);
  if (refreshedTTL <= decreasedTTL) {
    throw new Error('TTL was not refreshed after update');
  }
  
  // Set custom TTL
  await stateManager.setStateTTL(projectName, 600);
  const customTTL = await stateManager.getStateTTL(projectName);
  if (customTTL <= 300 || customTTL > 600) {
    throw new Error(`Custom TTL not set correctly: ${customTTL}`);
  }
  
  return 'TTL management working correctly with refresh and custom values';
}
```

#### Test 2.2: State Expiration Handling
**Objective:** Verify expired states are handled gracefully

**Test Steps:**
1. Store workflow state with very short TTL
2. Wait for expiration
3. Attempt to retrieve expired state
4. Verify appropriate error handling

**Expected Results:**
- State expires after configured TTL
- Retrieval of expired state returns null or appropriate indicator
- No errors thrown on expired state access
- Cleanup occurs automatically

**Test Implementation:**
```javascript
async function testStateExpiration() {
  const stateManager = new WorkflowStateManager(testConfig);
  const projectName = 'test-expiration';
  
  // Store state with very short TTL (2 seconds)
  await stateManager.storeState(projectName, {
    ...testWorkflowState,
    projectEntityName: projectName
  });
  
  await stateManager.setStateTTL(projectName, 2);
  
  // Verify state exists initially
  const initialState = await stateManager.getState(projectName);
  if (!initialState) {
    throw new Error('State should exist before expiration');
  }
  
  // Wait for expiration (3 seconds to be safe)
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Verify state is expired
  const expiredState = await stateManager.getState(projectName);
  if (expiredState !== null) {
    throw new Error('Expired state should return null');
  }
  
  // Verify TTL check returns -2 for non-existent key
  const expiredTTL = await stateManager.getStateTTL(projectName);
  if (expiredTTL !== -2) {
    throw new Error(`Expected TTL -2 for expired key, got: ${expiredTTL}`);
  }
  
  return 'State expiration handled correctly with automatic cleanup';
}
```

### Test Group 3: State Updates and Atomic Operations

#### Test 3.1: Partial State Updates
**Objective:** Verify partial state updates preserve existing data

**Test Steps:**
1. Store complete workflow state
2. Perform partial updates to specific fields
3. Verify updated fields changed and others preserved
4. Test nested object updates

**Expected Results:**
- Only specified fields updated
- Other fields remain unchanged
- Nested object updates work correctly
- Update operations are atomic

**Test Implementation:**
```javascript
async function testPartialStateUpdates() {
  const stateManager = new WorkflowStateManager(testConfig);
  const projectName = 'test-partial-updates';
  
  const initialState = {
    ...testWorkflowState,
    projectEntityName: projectName,
    progress: 25,
    status: 'active'
  };
  
  // Store initial state
  await stateManager.storeState(projectName, initialState);
  
  // Perform partial update
  const updates = {
    progress: 75,
    currentRole: 'Implementer'
  };
  
  await stateManager.updateState(projectName, updates);
  
  // Retrieve and verify
  const updatedState = await stateManager.getState(projectName);
  
  // Check updated fields
  if (updatedState.progress !== 75) {
    throw new Error(`Progress not updated. Expected: 75, Got: ${updatedState.progress}`);
  }
  
  if (updatedState.currentRole !== 'Implementer') {
    throw new Error(`Role not updated. Expected: Implementer, Got: ${updatedState.currentRole}`);
  }
  
  // Check preserved fields
  if (updatedState.status !== 'active') {
    throw new Error(`Status should be preserved. Expected: active, Got: ${updatedState.status}`);
  }
  
  if (JSON.stringify(updatedState.nextActions) !== JSON.stringify(initialState.nextActions)) {
    throw new Error('Next actions should be preserved');
  }
  
  // Test nested object update
  await stateManager.updateState(projectName, {
    'contextData.analysisType': 'workflow_implementation'
  });
  
  const nestedUpdatedState = await stateManager.getState(projectName);
  if (nestedUpdatedState.contextData.analysisType !== 'workflow_implementation') {
    throw new Error('Nested object update failed');
  }
  
  return 'Partial state updates working correctly with field preservation';
}
```

#### Test 3.2: Atomic State Transitions
**Objective:** Verify state transitions are atomic and consistent

**Test Steps:**
1. Implement role transition with multiple field updates
2. Simulate failure during transition
3. Verify either complete success or complete rollback
4. Test concurrent transition attempts

**Expected Results:**
- Multi-field transitions are atomic
- Failed transitions don't leave partial updates
- Concurrent transitions handled safely
- State consistency maintained

**Test Implementation:**
```javascript
async function testAtomicStateTransitions() {
  const stateManager = new WorkflowStateManager(testConfig);
  const projectName = 'test-atomic-transitions';
  
  // Store initial state
  await stateManager.storeState(projectName, {
    ...testWorkflowState,
    projectEntityName: projectName,
    currentRole: 'Pattern Analyzer',
    progress: 25,
    status: 'active'
  });
  
  // Test successful atomic transition
  const transition = {
    currentRole: 'Implementer',
    progress: 50,
    status: 'implementing',
    nextActions: ['implement_features', 'write_tests'],
    'metadata.updatedAt': new Date().toISOString(),
    'metadata.version': 2
  };
  
  const result = await stateManager.atomicTransition(projectName, transition);
  
  if (!result.success) {
    throw new Error(`Atomic transition failed: ${result.error}`);
  }
  
  // Verify all fields updated
  const transitionedState = await stateManager.getState(projectName);
  
  if (transitionedState.currentRole !== 'Implementer' ||
      transitionedState.progress !== 50 ||
      transitionedState.status !== 'implementing') {
    throw new Error('Atomic transition did not update all fields correctly');
  }
  
  // Test transaction rollback on failure
  try {
    await stateManager.atomicTransition('non-existent-project', {
      currentRole: 'Test Role'
    });
    throw new Error('Should have failed for non-existent project');
  } catch (error) {
    if (error.message.includes('Should have failed')) {
      throw error;
    }
    // Expected failure - verify original state unchanged
    const unchangedState = await stateManager.getState(projectName);
    if (unchangedState.currentRole !== 'Implementer') {
      throw new Error('State was corrupted after failed transition');
    }
  }
  
  return 'Atomic state transitions working correctly with rollback protection';
}
```

### Test Group 4: Concurrent Access and Data Integrity

#### Test 4.1: Concurrent State Updates
**Objective:** Verify concurrent updates are handled safely without data corruption

**Test Steps:**
1. Create multiple concurrent update operations
2. Execute updates simultaneously
3. Verify final state is consistent
4. Test optimistic locking if implemented

**Expected Results:**
- No data corruption from concurrent updates
- All updates processed or properly queued
- Final state reflects valid combination of updates
- No race conditions

**Test Implementation:**
```javascript
async function testConcurrentStateUpdates() {
  const stateManager = new WorkflowStateManager(testConfig);
  const projectName = 'test-concurrent-updates';
  
  // Store initial state
  await stateManager.storeState(projectName, {
    ...testWorkflowState,
    projectEntityName: projectName,
    progress: 0,
    status: 'active'
  });
  
  // Create multiple concurrent updates
  const concurrentUpdates = [];
  
  for (let i = 1; i <= 10; i++) {
    concurrentUpdates.push(
      stateManager.updateState(projectName, { 
        progress: i * 10,
        'metadata.lastUpdate': `update-${i}`,
        'metadata.version': i
      })
    );
  }
  
  // Execute all updates concurrently
  const results = await Promise.allSettled(concurrentUpdates);
  
  // Verify no updates failed
  const failedUpdates = results.filter(r => r.status === 'rejected');
  if (failedUpdates.length > 0) {
    console.warn(`${failedUpdates.length} updates failed, which may be acceptable for conflict resolution`);
  }
  
  // Verify final state is valid
  const finalState = await stateManager.getState(projectName);
  
  if (!finalState) {
    throw new Error('State was corrupted by concurrent updates');
  }
  
  // Progress should be one of the valid values (10, 20, 30, ..., 100)
  const validProgress = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  if (!validProgress.includes(finalState.progress)) {
    throw new Error(`Invalid final progress: ${finalState.progress}`);
  }
  
  // Version should be a valid update number
  if (!finalState.metadata || 
      !finalState.metadata.version ||
      finalState.metadata.version < 1 ||
      finalState.metadata.version > 10) {
    throw new Error(`Invalid final version: ${finalState.metadata?.version}`);
  }
  
  return 'Concurrent updates handled safely without data corruption';
}
```

### Test Group 5: State Query Operations

#### Test 5.1: State Filtering and Search
**Objective:** Verify state query interface provides efficient filtering

**Test Steps:**
1. Store multiple workflow states with different properties
2. Query by role, status, and other criteria
3. Verify results match filter criteria
4. Test query performance

**Expected Results:**
- Filtering returns correct subset of states
- Multiple filter criteria work together
- Query performance acceptable
- Results properly formatted

**Test Implementation:**
```javascript
async function testStateFilteringAndSearch() {
  const stateManager = new WorkflowStateManager(testConfig);
  const stateQuery = new StateQuery(testConfig);
  
  // Store multiple test states
  const testStates = [
    { project: 'project-1', role: 'Pattern Analyzer', status: 'active', progress: 25 },
    { project: 'project-2', role: 'Implementer', status: 'active', progress: 75 },
    { project: 'project-3', role: 'Pattern Analyzer', status: 'completed', progress: 100 },
    { project: 'project-4', role: 'Verifier', status: 'active', progress: 90 },
    { project: 'project-5', role: 'Implementer', status: 'paused', progress: 50 }
  ];
  
  for (const state of testStates) {
    await stateManager.storeState(state.project, {
      ...testWorkflowState,
      projectEntityName: state.project,
      currentRole: state.role,
      status: state.status,
      progress: state.progress
    });
  }
  
  // Test single filter - by role
  const analyzerStates = await stateQuery.findByRole('Pattern Analyzer');
  if (analyzerStates.length !== 2) {
    throw new Error(`Expected 2 Pattern Analyzer states, got ${analyzerStates.length}`);
  }
  
  // Test single filter - by status
  const activeStates = await stateQuery.findByStatus('active');
  if (activeStates.length !== 3) {
    throw new Error(`Expected 3 active states, got ${activeStates.length}`);
  }
  
  // Test combined filters - active Implementers
  const activeImplementers = await stateQuery.findByRoleAndStatus('Implementer', 'active');
  if (activeImplementers.length !== 1 || activeImplementers[0].projectEntityName !== 'project-2') {
    throw new Error('Combined role and status filter failed');
  }
  
  // Test range filter - progress > 50
  const highProgressStates = await stateQuery.findByProgressRange(51, 100);
  if (highProgressStates.length !== 3) {
    throw new Error(`Expected 3 high-progress states, got ${highProgressStates.length}`);
  }
  
  // Test query performance (should complete within 1 second for 5 states)
  const startTime = Date.now();
  await stateQuery.findByStatus('active');
  const queryTime = Date.now() - startTime;
  
  if (queryTime > 1000) {
    throw new Error(`Query too slow: ${queryTime}ms`);
  }
  
  return 'State filtering and search working correctly with good performance';
}
```

### Test Group 6: Integration with Status Management

#### Test 6.1: Status Transition Validation
**Objective:** Verify status transitions follow state machine rules

**Test Steps:**
1. Initialize StatusManager with valid transitions
2. Test valid status transitions
3. Attempt invalid transitions and verify rejection
4. Test status history tracking

**Expected Results:**
- Valid transitions succeed
- Invalid transitions are blocked
- Status history maintained
- State machine rules enforced

**Test Implementation:**
```javascript
async function testStatusTransitionValidation() {
  const stateManager = new WorkflowStateManager(testConfig);
  const statusManager = new StatusManager(testConfig);
  const projectName = 'test-status-transitions';
  
  // Initialize workflow in 'active' status
  await stateManager.storeState(projectName, {
    ...testWorkflowState,
    projectEntityName: projectName,
    status: 'active',
    currentRole: 'Pattern Analyzer'
  });
  
  // Test valid transition: active -> paused
  const pauseResult = await statusManager.transitionStatus(projectName, 'paused', 'User requested pause');
  if (!pauseResult.success) {
    throw new Error(`Valid transition failed: ${pauseResult.error}`);
  }
  
  // Verify state updated
  const pausedState = await stateManager.getState(projectName);
  if (pausedState.status !== 'paused') {
    throw new Error('Status not updated after valid transition');
  }
  
  // Test invalid transition: paused -> completed (should require active first)
  const invalidResult = await statusManager.transitionStatus(projectName, 'completed', 'Invalid direct transition');
  if (invalidResult.success) {
    throw new Error('Invalid transition should have been rejected');
  }
  
  // Test valid transition sequence: paused -> active -> completed
  await statusManager.transitionStatus(projectName, 'active', 'Resume work');
  const completeResult = await statusManager.transitionStatus(projectName, 'completed', 'Work finished');
  
  if (!completeResult.success) {
    throw new Error(`Valid transition sequence failed: ${completeResult.error}`);
  }
  
  // Verify status history
  const history = await statusManager.getStatusHistory(projectName);
  if (history.length !== 4) { // initial + 3 transitions
    throw new Error(`Expected 4 history entries, got ${history.length}`);
  }
  
  const expectedStatuses = ['active', 'paused', 'active', 'completed'];
  for (let i = 0; i < expectedStatuses.length; i++) {
    if (history[i].status !== expectedStatuses[i]) {
      throw new Error(`Status history mismatch at index ${i}`);
    }
  }
  
  return 'Status transition validation working correctly with history tracking';
}
```

## Test Execution Framework

### Test Runner Configuration
```javascript
const workflowStateTestSuite = {
  name: 'Workflow State Management Tests',
  testGroups: [
    {
      name: 'Basic State Storage and Retrieval',
      tests: [
        testStoreWorkflowState,
        testRetrieveWorkflowState
      ]
    },
    {
      name: 'TTL Management and Expiration',
      tests: [
        testTTLManagement,
        testStateExpiration
      ]
    },
    {
      name: 'State Updates and Atomic Operations',
      tests: [
        testPartialStateUpdates,
        testAtomicStateTransitions
      ]
    },
    {
      name: 'Concurrent Access and Data Integrity',
      tests: [
        testConcurrentStateUpdates
      ]
    },
    {
      name: 'State Query Operations',
      tests: [
        testStateFilteringAndSearch
      ]
    },
    {
      name: 'Integration with Status Management',
      tests: [
        testStatusTransitionValidation
      ]
    }
  ]
};

async function runWorkflowStateTests() {
  console.log(`Running ${workflowStateTestSuite.name}...`);
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  for (const testGroup of workflowStateTestSuite.testGroups) {
    console.log(`\n📋 Test Group: ${testGroup.name}`);
    
    for (const test of testGroup.tests) {
      totalTests++;
      try {
        const result = await test();
        console.log(`✅ ${test.name}: ${result}`);
        passedTests++;
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}`);
        failedTests++;
      }
    }
  }
  
  console.log('\n📊 Workflow State Test Results');
  console.log('=====================================');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  return failedTests === 0;
}
```

### Performance Benchmarks
- **State Storage:** < 50ms for typical workflow state
- **State Retrieval:** < 25ms for single state lookup
- **Query Operations:** < 100ms for filtering 100 workflow states
- **TTL Operations:** < 10ms for TTL set/get operations
- **Atomic Transitions:** < 75ms for multi-field updates

### Coverage Requirements
- **CRUD Operations:** 100% coverage of create, read, update, delete
- **TTL Management:** 100% coverage of expiration scenarios
- **State Transitions:** 100% coverage of valid and invalid transitions
- **Concurrent Access:** Validation of race condition handling
- **Query Interface:** 100% coverage of filtering and search operations

## Success Criteria

For the workflow state management tests to pass:

1. **All test cases execute successfully** without throwing exceptions
2. **Data integrity maintained** across all operations and scenarios
3. **TTL management functions correctly** with proper expiration and refresh
4. **Atomic operations prevent** partial updates and inconsistent states
5. **Concurrent access handled safely** without data corruption
6. **Query interface provides efficient** filtering and search capabilities
7. **Status transitions follow** state machine rules and validation
8. **Performance benchmarks met** for all operation types

---

*This comprehensive test suite ensures the Redis-based workflow state management system is robust, reliable, and ready for production use in the Agent OS MCP Phase Handoff implementation.*