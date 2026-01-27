// Jest setup file for Community API tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.PORT = '3001';

// Increase timeout for async operations
jest.setTimeout(10000);

// Mock console.log in tests to reduce noise
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
