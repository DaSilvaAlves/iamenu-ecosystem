// Jest setup file for Marketplace API tests
import prisma from '../src/lib/prisma';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.PORT = '3002';

jest.setTimeout(15000);

// Mock console.log to reduce noise in tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(async () => {
  jest.restoreAllMocks();
  await prisma.$disconnect();
});

// Test JWT token for authenticated requests
export const TEST_USER_ID = 'test-user-id-12345';
export const TEST_JWT_TOKEN = generateTestToken(TEST_USER_ID);

function generateTestToken(userId: string): string {
  // Simple JWT for testing - in real tests you'd use jsonwebtoken
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    userId,
    email: 'test@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  // Note: This is a mock signature - real JWT validation is mocked in tests
  const signature = 'test-signature';
  return `${header}.${payload}.${signature}`;
}
