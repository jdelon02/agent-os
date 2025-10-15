# Phase A Integration Test Guide

## Overview

The Phase A Integration Tests provide comprehensive end-to-end validation of the Redis MCP Phase Handoff Foundation, covering all components implemented in Phase A of the Agent OS architecture.

## Test Coverage

### A1: Redis Infrastructure Foundation
- **A1.1**: Redis Client Operations
  - Connection management and basic operations
  - Error handling and recovery
  - Performance monitoring
- **A1.2**: Redis Service Detection
  - Health monitoring and status reporting
  - Metrics collection and analysis

### A2: Workflow State Operations
- **A2.1**: State Management
  - CRUD operations for workflow states
  - Data validation and integrity
  - TTL and expiration handling
- **A2.2**: State Query Interface
  - Query by role, status, and complex criteria
  - Performance optimization and caching
  - Pagination and sorting
- **A2.3**: Status Management
  - State machine validation
  - Status transition rules
  - History tracking and audit trails

### A3: Redis MCP Integration
- **A3.1**: Dual-Memory Architecture
  - Redis primary with MCP fallback
  - Integration state management
  - Data enrichment and metadata tracking
- **A3.2**: Failover Scenarios
  - Manual and automatic failover
  - Circuit breaker functionality
  - Recovery mechanisms
- **A3.3**: Data Synchronization
  - Bidirectional sync operations
  - Conflict detection and resolution

### End-to-End Tests
- **E2E.1**: Complete Workflow Lifecycle
  - Full workflow from creation to completion
  - Role transitions and progress tracking
- **E2E.2**: Multi-Project Management
  - Concurrent workflow handling
  - Cross-project queries and operations

### Performance Tests
- **PERF.1**: State Operation Throughput
  - Batch operation performance
  - Concurrent user simulation
- **PERF.2**: Query Performance
  - Average query response times
  - Cache effectiveness

### Failure Recovery Tests
- **FAIL.1**: Connection Recovery
  - Disconnect and reconnect scenarios
  - Data integrity after recovery
- **FAIL.2**: Circuit Breaker
  - Failure threshold testing
  - Automatic failover triggers

## Prerequisites

### Redis Server
```bash
# macOS with Homebrew
brew install redis
brew services start redis

# Manual start
redis-server

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

### Node.js Dependencies
```bash
# Install required packages (if not already installed)
npm install
```

### Environment Setup
- Redis server running on localhost:6379 (default)
- Node.js version 14+ 
- Write permissions for test data cleanup
- Network access for Redis connections

## Running the Tests

### Basic Execution
```bash
# Run all Phase A integration tests
node run-phase-a-tests.js

# Or directly execute the test file
node tests/integration/phase-a-integration-tests.js
```

### Advanced Options
```bash
# Custom Redis configuration
node run-phase-a-tests.js --redis-host 192.168.1.100 --redis-port 6380

# Verbose output with detailed logging
node run-phase-a-tests.js --verbose

# Performance benchmarks enabled (default)
node run-phase-a-tests.js --performance

# Show help and all options
node run-phase-a-tests.js --help
```

### Docker Environment
```bash
# Start Redis in Docker (if needed)
docker run -d --name redis-test -p 6379:6379 redis:7-alpine

# Run tests against Docker Redis
node run-phase-a-tests.js --redis-host localhost --redis-port 6379

# Cleanup
docker stop redis-test && docker rm redis-test
```

## Test Results

### Success Criteria
- **100% test pass rate** - All tests must pass
- **Performance benchmarks** - Meet minimum thresholds:
  - State operations: >10 ops/second
  - Query performance: <100ms average
- **Zero data corruption** - All data integrity checks pass
- **Complete coverage** - All Phase A components tested

### Sample Output
```
🔬 Phase A Integration Test Runner
==================================

🔍 Validating Redis connection...
✅ Redis connection validated: localhost:6379

🚀 Starting Phase A Integration Tests...

🔧 Testing Redis Infrastructure Foundation (A1)...
  🧪 A1.1.1: Redis Connection
  ✅ A1.1.1: Redis Connection - PASSED
  🧪 A1.1.2: Redis Basic Operations
  ✅ A1.1.2: Redis Basic Operations - PASSED

📊 Testing Workflow State Operations (A2)...
  🧪 A2.1.1: Create Workflow State
  ✅ A2.1.1: Create Workflow State - PASSED

🔗 Testing Redis MCP Integration (A3)...
  🧪 A3.1.1: Integration Status
  ✅ A3.1.1: Integration Status - PASSED

🎯 Running End-to-End Workflow Tests...
  🧪 E2E.1: Complete Workflow Lifecycle
  ✅ E2E.1: Complete Workflow Lifecycle - PASSED

⚡ Running Performance Benchmarks...
  📈 State operations: 100 ops in 845ms (118.34 ops/sec)
  📊 Query performance: 50 queries in 234ms (4.68ms avg)

🛡️ Testing Failure Recovery Scenarios...
  🧪 FAIL.1: Connection Recovery
  ✅ FAIL.1: Connection Recovery - PASSED

📊 PHASE A INTEGRATION TEST REPORT
=====================================
⏱️ Total Duration: 3247ms
✅ Tests Passed: 25
❌ Tests Failed: 0
⏭️ Tests Skipped: 1
📈 Success Rate: 96.2%

⚡ PERFORMANCE METRICS
=====================
📊 State Operations: 118.34 ops/sec
🔍 Query Performance: 4.68ms avg

🎉 ALL PHASE A INTEGRATION TESTS PASSED!
Phase A Foundation is ready for Phase B Implementation.

📋 Next Steps:
   • Phase A Foundation is complete
   • Ready to proceed to Phase B Implementation
   • Review performance metrics for optimization opportunities
```

## Test Configuration

### Redis Configuration
```javascript
const TEST_CONFIG = {
  redis: {
    host: 'localhost',
    port: 6379,
    keyPrefix: 'test_phase_a:',
    maxRetries: 3,
    retryDelay: 1000
  },
  integration: {
    fallbackStrategy: 'graceful',
    enableAutoSync: false,
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
```

### Test Data
- All test data uses the `test_phase_a:` key prefix
- Test data is automatically cleaned up after each run
- No persistent data is created outside the test scope

## Troubleshooting

### Common Issues

#### Redis Connection Failed
```
❌ Redis connection failed: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution**: Ensure Redis is running
```bash
brew services start redis  # macOS
redis-server               # Manual start
```

#### Permission Denied
```
❌ Test execution failed: Permission denied
```
**Solution**: Make test runner executable
```bash
chmod +x run-phase-a-tests.js
```

#### Memory Issues
```
❌ JavaScript heap out of memory
```
**Solution**: Increase Node.js memory limit
```bash
node --max-old-space-size=4096 run-phase-a-tests.js
```

#### Test Timeouts
```
❌ A2.2.4: Query Performance - FAILED: Query should complete within 5 seconds
```
**Solution**: Check Redis performance and optimize queries

### Debug Mode
```bash
# Enable Node.js debugging
DEBUG=* node run-phase-a-tests.js

# Verbose test output
node run-phase-a-tests.js --verbose
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Phase A Integration Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      redis:
        image: redis:7
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: node run-phase-a-tests.js --redis-host localhost
```

### Docker Compose
```yaml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
  
  test-runner:
    build: .
    depends_on: [redis]
    command: node run-phase-a-tests.js --redis-host redis
```

## Performance Benchmarks

### Expected Performance
| Metric | Minimum | Target | Excellent |
|--------|---------|--------|-----------|
| State Operations | 10 ops/sec | 50 ops/sec | 100+ ops/sec |
| Query Response | <100ms | <50ms | <25ms |
| Memory Usage | <500MB | <250MB | <100MB |
| Test Duration | <30s | <15s | <10s |

### Optimization Tips
1. **Redis Configuration**: Tune Redis memory and persistence settings
2. **Connection Pooling**: Use Redis connection pools for high concurrency
3. **Query Optimization**: Implement efficient query patterns and indexes
4. **Caching**: Leverage Redis and application-level caching
5. **Monitoring**: Track performance metrics and optimize bottlenecks

## Test Maintenance

### Adding New Tests
1. Create test function in `PhaseAIntegrationTests` class
2. Add test to appropriate test group method
3. Follow naming convention: `ComponentGroup.SubGroup.TestNumber: Description`
4. Include assertions and error handling
5. Update test documentation

### Test Data Management
- Use consistent test project names from `TEST_PROJECTS` array
- Clean up test data in `cleanupTestEnvironment()`
- Prefix all test keys with `test_phase_a:`
- Avoid hardcoded values that could conflict

### Error Handling
- All tests should include proper error assertions
- Use descriptive error messages
- Log errors with context for debugging
- Include cleanup in `finally` blocks where needed

## Phase B Readiness

Phase A Integration Tests validate readiness for Phase B Implementation by ensuring:

✅ **Foundation Stability**: All core components work reliably
✅ **Performance Requirements**: Meet minimum performance thresholds  
✅ **Integration Patterns**: MCP fallback mechanisms function correctly
✅ **Error Recovery**: System handles failures gracefully
✅ **Data Integrity**: No data corruption under normal and failure conditions
✅ **Scalability**: Architecture supports concurrent operations

**Status**: Phase A Foundation ready for Phase B Implementation handoff.