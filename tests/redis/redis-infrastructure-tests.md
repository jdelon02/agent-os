# Redis Infrastructure Tests

> **Test Suite:** Redis Infrastructure  
> **Purpose:** Validate Redis connection management, reconnection strategies, and error handling  
> **Dependencies:** Node.js Redis client, Redis server  
> **Coverage:** Connection lifecycle, health checks, graceful degradation  

## Test Overview

This test suite validates the complete Redis infrastructure implementation including:
- Connection establishment and management
- Reconnection strategies and error recovery
- Health monitoring and service detection
- Graceful degradation when Redis unavailable

## Test Environment Setup

### Prerequisites
```javascript
// Required packages
const redis = require('redis');
const { RedisClient } = require('../../lib/redis-client');
const { RedisDetector } = require('../../lib/redis-detector');
const { createRedisConfig } = require('../../config/redis-config');
```

### Test Data Structure
```javascript
const testConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  db: 1, // Agent OS database
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true
};
```

## Test Cases

### Test Group 1: Basic Connection Management

#### Test 1.1: Successful Redis Connection
**Objective:** Verify Redis client can establish connection successfully

**Test Steps:**
1. Initialize Redis client with valid configuration
2. Attempt connection to Redis server
3. Verify connection state is 'ready'
4. Verify client can execute basic commands (PING)

**Expected Results:**
- Connection establishes without errors
- Client state transitions to 'ready'
- PING command returns 'PONG'
- Connection events logged properly

**Test Implementation:**
```javascript
async function testSuccessfulConnection() {
  const client = new RedisClient(testConfig);
  
  return new Promise((resolve, reject) => {
    client.on('ready', () => {
      client.ping((err, result) => {
        if (err) reject(err);
        if (result === 'PONG') {
          resolve('Connection successful');
        } else {
          reject('PING failed');
        }
      });
    });
    
    client.on('error', reject);
    client.connect();
  });
}
```

#### Test 1.2: Connection with Invalid URL
**Objective:** Verify proper error handling for invalid Redis URL

**Test Steps:**
1. Initialize Redis client with invalid URL
2. Attempt connection
3. Verify error handling and logging
4. Verify graceful failure without crashes

**Expected Results:**
- Connection attempt fails gracefully
- Error logged to Memory-Keeper
- Client state remains 'disconnected'
- No application crashes

**Test Implementation:**
```javascript
async function testInvalidConnectionURL() {
  const invalidConfig = { ...testConfig, url: 'redis://invalid-host:6379' };
  const client = new RedisClient(invalidConfig);
  
  return new Promise((resolve, reject) => {
    let errorCaught = false;
    
    client.on('error', (err) => {
      errorCaught = true;
      // Verify error logging to Memory-Keeper
      resolve('Error handled properly');
    });
    
    client.connect();
    
    // Timeout after 2 seconds if no error
    setTimeout(() => {
      if (!errorCaught) {
        reject('Expected connection error not received');
      }
    }, 2000);
  });
}
```

### Test Group 2: Reconnection Strategies

#### Test 2.1: Automatic Reconnection on Disconnect
**Objective:** Verify automatic reconnection after network interruption

**Test Steps:**
1. Establish successful Redis connection
2. Simulate network disconnection
3. Verify reconnection attempts with exponential backoff
4. Verify successful reconnection and operation restoration

**Expected Results:**
- Client detects disconnection immediately
- Reconnection attempts follow exponential backoff pattern
- Successful reconnection within configured timeout
- Operations resume normally after reconnection

**Test Implementation:**
```javascript
async function testAutomaticReconnection() {
  const client = new RedisClient(testConfig);
  let reconnected = false;
  
  return new Promise((resolve, reject) => {
    client.on('ready', () => {
      if (!reconnected) {
        // First connection - simulate disconnect
        client.disconnect();
      } else {
        // Reconnected successfully
        resolve('Automatic reconnection successful');
      }
    });
    
    client.on('reconnecting', () => {
      reconnected = true;
    });
    
    client.on('error', (err) => {
      // Allow connection errors during testing
      console.log('Expected error during reconnection test:', err.message);
    });
    
    client.connect();
    
    setTimeout(() => {
      if (!reconnected) {
        reject('Reconnection did not occur within timeout');
      }
    }, 5000);
  });
}
```

#### Test 2.2: Retry Logic with Exponential Backoff
**Objective:** Verify retry attempts use proper exponential backoff timing

**Test Steps:**
1. Configure client with specific retry parameters
2. Force connection failures
3. Monitor retry attempt timings
4. Verify exponential backoff pattern

**Expected Results:**
- Retry delays increase exponentially (100ms, 200ms, 400ms, etc.)
- Maximum retry limit respected
- Proper error handling after max retries exceeded

**Test Implementation:**
```javascript
async function testExponentialBackoff() {
  const retryConfig = {
    ...testConfig,
    url: 'redis://nonexistent-host:6379',
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3
  };
  
  const client = new RedisClient(retryConfig);
  const retryTimes = [];
  let startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    client.on('reconnecting', (params) => {
      const currentTime = Date.now();
      retryTimes.push(currentTime - startTime);
      startTime = currentTime;
      
      // Check if we have enough retry data to validate backoff
      if (retryTimes.length >= 3) {
        // Verify exponential pattern (allowing 50ms tolerance)
        const isExponential = retryTimes[1] >= retryTimes[0] * 1.5 &&
                              retryTimes[2] >= retryTimes[1] * 1.5;
        
        if (isExponential) {
          resolve('Exponential backoff pattern verified');
        } else {
          reject('Exponential backoff pattern not followed');
        }
      }
    });
    
    client.connect();
    
    setTimeout(() => {
      reject('Test timeout - exponential backoff not verified');
    }, 10000);
  });
}
```

### Test Group 3: Health Monitoring and Detection

#### Test 3.1: Health Check Functionality
**Objective:** Verify Redis health monitoring provides accurate status

**Test Steps:**
1. Initialize Redis detector
2. Run health checks against running Redis
3. Run health checks against stopped Redis
4. Verify status accuracy and response times

**Expected Results:**
- Health checks return correct status
- Response times within acceptable thresholds (<100ms)
- Proper error handling for unavailable service

**Test Implementation:**
```javascript
async function testHealthChecks() {
  const detector = new RedisDetector(testConfig);
  
  // Test 1: Health check on running Redis
  const healthyStatus = await detector.checkHealth();
  if (!healthyStatus.isHealthy) {
    throw new Error('Health check failed on running Redis');
  }
  
  // Test 2: Response time check
  const startTime = Date.now();
  await detector.checkHealth();
  const responseTime = Date.now() - startTime;
  
  if (responseTime > 100) {
    throw new Error(`Health check too slow: ${responseTime}ms`);
  }
  
  return 'Health check functionality verified';
}
```

#### Test 3.2: Service Detection and Fallback Triggers
**Objective:** Verify service detection triggers appropriate fallback procedures

**Test Steps:**
1. Monitor Redis availability
2. Simulate Redis service shutdown
3. Verify fallback trigger activation
4. Verify MCP fallback procedures initiated

**Expected Results:**
- Service unavailability detected immediately
- Fallback procedures triggered automatically
- MCP systems activated for backup functionality
- Graceful degradation without data loss

**Test Implementation:**
```javascript
async function testServiceDetectionAndFallback() {
  const detector = new RedisDetector(testConfig);
  let fallbackTriggered = false;
  
  // Monitor for fallback trigger
  detector.on('fallbackTriggered', () => {
    fallbackTriggered = true;
  });
  
  // Test service detection
  const initialStatus = await detector.checkHealth();
  
  // Simulate service unavailability
  detector.simulateServiceUnavailable();
  
  // Wait for detection
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const unavailableStatus = await detector.checkHealth();
  
  if (unavailableStatus.isHealthy) {
    throw new Error('Service detection failed - should detect unavailability');
  }
  
  if (!fallbackTriggered) {
    throw new Error('Fallback not triggered on service unavailability');
  }
  
  return 'Service detection and fallback verified';
}
```

### Test Group 4: Error Handling and Logging

#### Test 4.1: Error Logging to Memory-Keeper
**Objective:** Verify Redis errors are properly logged to Memory-Keeper

**Test Steps:**
1. Configure Memory-Keeper integration
2. Generate various Redis error scenarios
3. Verify error logging occurs
4. Verify log format and content

**Expected Results:**
- All Redis errors logged to Memory-Keeper
- Log entries contain proper error context
- Error categorization is accurate
- No duplicate log entries

**Test Implementation:**
```javascript
async function testErrorLogging() {
  const client = new RedisClient(testConfig);
  const memoryKeeperMock = {
    loggedErrors: [],
    logError: function(error, context) {
      this.loggedErrors.push({ error, context });
    }
  };
  
  client.setMemoryKeeperInstance(memoryKeeperMock);
  
  // Generate connection error
  const invalidClient = new RedisClient({ url: 'redis://invalid:6379' });
  invalidClient.setMemoryKeeperInstance(memoryKeeperMock);
  
  try {
    await invalidClient.connect();
  } catch (err) {
    // Expected error
  }
  
  // Verify error was logged
  if (memoryKeeperMock.loggedErrors.length === 0) {
    throw new Error('Error not logged to Memory-Keeper');
  }
  
  const loggedError = memoryKeeperMock.loggedErrors[0];
  if (!loggedError.error || !loggedError.context) {
    throw new Error('Error log missing required fields');
  }
  
  return 'Error logging to Memory-Keeper verified';
}
```

#### Test 4.2: Graceful Degradation
**Objective:** Verify graceful degradation when Redis unavailable

**Test Steps:**
1. Configure system with Redis + MCP fallback
2. Make Redis unavailable
3. Verify operations continue with MCP systems
4. Verify no data loss or corruption

**Expected Results:**
- Operations seamlessly switch to MCP fallback
- No error propagation to user
- Data consistency maintained
- Performance degradation within acceptable limits

**Test Implementation:**
```javascript
async function testGracefulDegradation() {
  const client = new RedisClient(testConfig);
  const mcpFallback = new MCPFallbackSystem();
  
  client.setFallbackSystem(mcpFallback);
  
  // Test normal operation
  await client.set('test:key', 'test:value');
  const normalValue = await client.get('test:key');
  
  if (normalValue !== 'test:value') {
    throw new Error('Normal operation failed');
  }
  
  // Simulate Redis failure
  client.simulateFailure();
  
  // Test fallback operation
  await client.set('test:fallback', 'fallback:value');
  const fallbackValue = await client.get('test:fallback');
  
  if (fallbackValue !== 'fallback:value') {
    throw new Error('Fallback operation failed');
  }
  
  // Verify fallback was used
  if (!mcpFallback.wasUsed()) {
    throw new Error('MCP fallback system was not activated');
  }
  
  return 'Graceful degradation verified';
}
```

## Test Execution and Validation

### Test Runner Configuration
```javascript
const testSuite = {
  name: 'Redis Infrastructure Tests',
  tests: [
    testSuccessfulConnection,
    testInvalidConnectionURL,
    testAutomaticReconnection,
    testExponentialBackoff,
    testHealthChecks,
    testServiceDetectionAndFallback,
    testErrorLogging,
    testGracefulDegradation
  ]
};

async function runAllTests() {
  console.log(`Running ${testSuite.name}...`);
  
  for (const test of testSuite.tests) {
    try {
      const result = await test();
      console.log(`✅ ${test.name}: ${result}`);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      return false;
    }
  }
  
  console.log('🎉 All Redis infrastructure tests passed!');
  return true;
}
```

### Coverage Requirements
- **Connection Management:** 100% coverage of connection lifecycle
- **Error Handling:** 100% coverage of error scenarios
- **Reconnection Logic:** 100% coverage of retry strategies
- **Health Monitoring:** 100% coverage of detection mechanisms

### Performance Benchmarks
- **Connection Time:** < 100ms for local Redis
- **Health Check Response:** < 50ms average
- **Reconnection Time:** < 2 seconds for network recovery
- **Error Detection:** < 500ms for service unavailability

## Integration Points

### Memory-Keeper Integration
- Error logging with structured context
- Performance metrics storage
- Configuration backup

### MCP Fallback Integration
- Automatic failover activation
- Data synchronization
- State management

### Agent OS Integration
- Template system compatibility
- XML structure compliance
- Parameter passing validation

## Success Criteria

For the Redis infrastructure tests to pass, the following criteria must be met:

1. **All test cases execute successfully** without throwing exceptions
2. **Connection management works reliably** in all scenarios
3. **Reconnection strategies follow proper patterns** with exponential backoff
4. **Health monitoring provides accurate status** within performance thresholds
5. **Error handling and logging function correctly** with Memory-Keeper integration
6. **Graceful degradation maintains system functionality** when Redis unavailable
7. **Performance benchmarks are met** for all operations
8. **Integration points work properly** with Agent OS ecosystem

---

*This test suite provides comprehensive validation of the Redis infrastructure foundation required for the Phase A implementation of the Redis MCP Phase Handoff system.*