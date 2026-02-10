#!/usr/bin/env node

/**
 * Prism Mock Server Test Suite
 * Tests connectivity and responses from all mock servers
 */

const http = require('http');

const SERVICES = [
  {
    name: 'Community',
    icon: '🔵',
    port: 4001,
    healthCheck: '/api/v1/community/posts'
  },
  {
    name: 'Marketplace',
    icon: '🟢',
    port: 4002,
    healthCheck: '/api/v1/marketplace/suppliers'
  },
  {
    name: 'Academy',
    icon: '🟡',
    port: 4003,
    healthCheck: '/api/v1/academy/courses'
  },
  {
    name: 'Business',
    icon: '🔴',
    port: 4004,
    healthCheck: '/api/v1/business/dashboard/stats'
  }
];

const GATEWAY = {
  name: 'Mock API Gateway',
  icon: '🌐',
  port: 9000,
  healthCheck: '/status'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

async function testEndpoint(host, port, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: host || 'localhost',
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          statusCode: res.statusCode,
          data: data.substring(0, 200) // First 200 chars
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log(colorize('\n🍽️  iaMenu Prism Mock Server Test Suite\n', colors.blue));
  console.log(colorize('Testing connectivity and responses...\n', colors.cyan));

  let passed = 0;
  let failed = 0;

  // Test individual services
  console.log(colorize('📍 Individual Mock Servers:', colors.yellow));
  console.log('');

  for (const service of SERVICES) {
    process.stdout.write(`${service.icon} ${service.name.padEnd(15)} (localhost:${service.port})... `);

    const result = await testEndpoint('localhost', service.port, service.healthCheck);

    if (result.success) {
      console.log(colorize('✅ OK', colors.green));
      passed++;

      // Show sample response
      console.log(`   └─ Status: ${result.statusCode}`);
      if (result.data) {
        try {
          const json = JSON.parse(result.data);
          console.log(`   └─ Response type: ${typeof json === 'array' ? 'Array' : 'Object'}`);
        } catch (e) {
          console.log(`   └─ Response length: ${result.data.length} chars`);
        }
      }
    } else {
      console.log(colorize('❌ FAILED', colors.red));
      failed++;
      console.log(`   └─ Error: ${result.error || result.statusCode}`);
    }
  }

  console.log('');
  console.log(colorize('🌐 Mock API Gateway:', colors.yellow));
  console.log('');

  process.stdout.write(`${GATEWAY.icon} ${GATEWAY.name.padEnd(15)} (localhost:${GATEWAY.port})... `);
  const gatewayResult = await testEndpoint('localhost', GATEWAY.port, GATEWAY.healthCheck);

  if (gatewayResult.success) {
    console.log(colorize('✅ OK', colors.green));
    passed++;
    console.log(`   └─ Status: ${gatewayResult.statusCode}`);
  } else {
    console.log(colorize('❌ FAILED', colors.red));
    failed++;
    console.log(`   └─ Error: ${gatewayResult.error || gatewayResult.statusCode}`);
  }

  // Test gateway proxying
  console.log('');
  console.log(colorize('✓ Testing Gateway Proxying:', colors.yellow));
  console.log('');

  const gatewayServices = [
    { name: 'Community', path: '/api/v1/community/posts' },
    { name: 'Marketplace', path: '/api/v1/marketplace/suppliers' },
    { name: 'Academy', path: '/api/v1/academy/courses' },
    { name: 'Business', path: '/api/v1/business/dashboard/stats' }
  ];

  for (const svc of gatewayServices) {
    process.stdout.write(`   ${svc.name.padEnd(15)} via gateway... `);
    const proxyResult = await testEndpoint('localhost', 9000, svc.path);

    if (proxyResult.success) {
      console.log(colorize('✅ OK', colors.green));
      passed++;
    } else {
      console.log(colorize('❌ FAILED', colors.red));
      failed++;
      console.log(`      └─ Error: ${proxyResult.error}`);
    }
  }

  // Summary
  console.log('');
  console.log(colorize('═'.repeat(50), colors.cyan));
  console.log('');

  if (failed === 0) {
    console.log(colorize(`✅ All ${passed} tests passed!`, colors.green));
    console.log('');
    console.log(colorize('📍 Mock API URLs Ready:', colors.yellow));
    console.log('');
    console.log('   Gateway (unified):');
    console.log(colorize('   http://localhost:9000', colors.cyan));
    console.log('');
    console.log('   Individual services:');
    for (const service of SERVICES) {
      console.log(colorize(`   http://localhost:${service.port}`, colors.cyan));
    }
    console.log('');
  } else {
    console.log(colorize(`❌ ${failed} test(s) failed, ${passed} passed`, colors.red));
    console.log('');
    console.log('Troubleshooting tips:');
    console.log('  1. Check if Docker is running: docker ps');
    console.log('  2. Start mock servers: npm run prism:start');
    console.log('  3. View logs: npm run prism:logs');
    console.log('');
  }

  console.log(colorize('═'.repeat(50), colors.cyan));
  console.log('');

  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch((error) => {
  console.error(colorize(`\n❌ Test suite error: ${error.message}`, colors.red));
  process.exit(1);
});
