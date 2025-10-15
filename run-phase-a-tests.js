#!/usr/bin/env node

/**
 * Phase A Integration Test Runner
 * 
 * @description Execute comprehensive Phase A integration tests
 * @version 1.0.0
 * 
 * Usage:
 *   node run-phase-a-tests.js [options]
 * 
 * Options:
 *   --redis-host <host>     Redis host (default: localhost)
 *   --redis-port <port>     Redis port (default: 6379) 
 *   --verbose               Enable verbose output
 *   --performance           Run performance benchmarks
 *   --skip-setup            Skip test environment setup
 *   --help                  Show help
 */

const { PhaseAIntegrationTests } = require('./tests/integration/phase-a-integration-tests');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  redisHost: 'localhost',
  redisPort: 6379,
  verbose: false,
  performance: true,
  skipSetup: false,
  help: false
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  switch (arg) {
    case '--redis-host':
      options.redisHost = args[++i];
      break;
    case '--redis-port':
      options.redisPort = parseInt(args[++i]);
      break;
    case '--verbose':
      options.verbose = true;
      break;
    case '--performance':
      options.performance = true;
      break;
    case '--skip-setup':
      options.skipSetup = true;
      break;
    case '--help':
      options.help = true;
      break;
    default:
      if (arg.startsWith('--')) {
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
      }
  }
}

// Show help
if (options.help) {
  console.log(`
Phase A Integration Test Runner

Usage: node run-phase-a-tests.js [options]

Options:
  --redis-host <host>     Redis host (default: localhost)
  --redis-port <port>     Redis port (default: 6379)
  --verbose               Enable verbose output
  --performance           Run performance benchmarks (default: true)
  --skip-setup            Skip test environment setup
  --help                  Show this help

Examples:
  node run-phase-a-tests.js
  node run-phase-a-tests.js --redis-host 192.168.1.100 --redis-port 6380
  node run-phase-a-tests.js --verbose --performance
`);
  process.exit(0);
}

/**
 * Main test execution function
 */
async function runTests() {
  console.log('🔬 Phase A Integration Test Runner');
  console.log('==================================\n');
  
  // Validate Redis connection
  console.log('🔍 Validating Redis connection...');
  try {
    const { RedisClient } = require('./lib/redis-client');
    const { createUseCaseConfig } = require('./config/redis-config');
    
    const testClient = new RedisClient(createUseCaseConfig('test', {
      host: options.redisHost,
      port: options.redisPort,
      keyPrefix: 'test_validation:'
    }));
    
    await testClient.connect();
    const response = await testClient.ping();
    await testClient.disconnect();
    
    if (response !== 'PONG') {
      throw new Error('Redis ping failed');
    }
    
    console.log(`✅ Redis connection validated: ${options.redisHost}:${options.redisPort}\n`);
    
  } catch (error) {
    console.error(`❌ Redis connection failed: ${error.message}`);
    console.error('\n💡 Make sure Redis is running and accessible:');
    console.error(`   Host: ${options.redisHost}`);
    console.error(`   Port: ${options.redisPort}`);
    console.error('\nTo start Redis locally:');
    console.error('   brew services start redis  (macOS)');
    console.error('   redis-server               (manual start)');
    process.exit(1);
  }
  
  // Initialize and run test suite
  try {
    const testSuite = new PhaseAIntegrationTests();
    
    // Override test configuration based on options
    if (testSuite.TEST_CONFIG) {
      testSuite.TEST_CONFIG.redis.host = options.redisHost;
      testSuite.TEST_CONFIG.redis.port = options.redisPort;
    }
    
    console.log('🚀 Starting Phase A Integration Tests...');
    console.log(`📍 Target: ${options.redisHost}:${options.redisPort}`);
    console.log(`🎯 Performance Benchmarks: ${options.performance ? 'Enabled' : 'Disabled'}`);
    console.log(`🔊 Verbose Mode: ${options.verbose ? 'Enabled' : 'Disabled'}\n`);
    
    const results = await testSuite.runAllTests();
    
    // Exit with appropriate code
    const exitCode = results.failed > 0 ? 1 : 0;
    
    if (exitCode === 0) {
      console.log('🎉 All tests passed! Phase A Foundation is ready.');
    } else {
      console.log(`⚠️  ${results.failed} test(s) failed. Please review and fix issues.`);
    }
    
    console.log('\n📋 Next Steps:');
    if (exitCode === 0) {
      console.log('   • Phase A Foundation is complete');
      console.log('   • Ready to proceed to Phase B Implementation'); 
      console.log('   • Review performance metrics for optimization opportunities');
    } else {
      console.log('   • Fix failing tests before proceeding');
      console.log('   • Check Redis configuration and connectivity');
      console.log('   • Review error messages for specific issues');
    }
    
    process.exit(exitCode);
    
  } catch (error) {
    console.error(`❌ Test execution failed: ${error.message}`);
    if (options.verbose) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

/**
 * Handle process signals gracefully
 */
process.on('SIGINT', () => {
  console.log('\n🛑 Test execution interrupted by user');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Test execution terminated');
  process.exit(143);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the tests
runTests().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});