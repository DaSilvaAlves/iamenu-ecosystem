#!/usr/bin/env node

/**
 * AIOS CLI Runner
 * Entry point that actually executes the CLI
 */

const { run } = require('./cli');

// Run with command line arguments
run(process.argv).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
