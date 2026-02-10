/**
 * Test Suite Setup
 * Global configuration for API tests
 */

import axios from 'axios';

// Global test config
export const TEST_CONFIG = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:9000/api/v1',
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
  TEST_TOKEN: process.env.TEST_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InRlc3RAaWFtZW51LnB0Iiwicm9sZSI6InVzZXIifQ.test',
};

// Setup axios instance
export const apiClient = axios.create({
  baseURL: TEST_CONFIG.API_BASE_URL,
  timeout: TEST_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_CONFIG.TEST_TOKEN}`
  }
});

// Global test timeout
jest.setTimeout(30000);

// Log test environment
console.log(`\n📍 API Testing Suite\n`);
console.log(`Base URL: ${TEST_CONFIG.API_BASE_URL}`);
console.log(`Timeout: ${TEST_CONFIG.API_TIMEOUT}ms`);
console.log(`Environment: ${process.env.NODE_ENV || 'test'}\n`);

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
