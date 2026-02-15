/**
 * Artillery Load Test Processor
 * Handles custom logic for load testing scenarios
 */

module.exports = {
  // Setup function runs before the test starts
  setup: function(context, ee, next) {
    console.log('🚀 Load Testing: Setup phase');
    context.vars.test_start = Date.now();
    next();
  },

  // Cleanup function runs after the test ends
  cleanup: function(context, ee, next) {
    const duration = Date.now() - context.vars.test_start;
    console.log(`⏱️  Load Testing: Completed in ${duration}ms`);
    next();
  },

  // Before request hook
  beforeRequest: function(requestParams, context, ee, next) {
    // Add common headers
    requestParams.headers = requestParams.headers || {};
    requestParams.headers['X-Load-Test'] = 'true';
    requestParams.headers['User-Agent'] = 'Artillery-LoadTester/2.0';

    // Add JWT token if needed (for authenticated endpoints)
    if (process.env.JWT_TOKEN) {
      requestParams.headers['Authorization'] = `Bearer ${process.env.JWT_TOKEN}`;
    }

    next();
  },

  // After response hook
  afterResponse: function(requestParams, responseParams, context, ee, next) {
    // Log slow requests (>200ms)
    if (responseParams.statusCode && responseParams.statusCode >= 400) {
      console.warn(
        `⚠️  Error in ${requestParams.name}: ${responseParams.statusCode}`
      );
    }

    next();
  },
};
