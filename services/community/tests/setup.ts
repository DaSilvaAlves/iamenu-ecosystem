// Jest setup file for Community API tests
import prisma from '../src/lib/prisma';

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

afterAll(async () => {
  jest.restoreAllMocks();
  // Close Prisma connection to prevent open handles
  await prisma.$disconnect();
});
