/**
 * JWT Authentication Middleware Tests
 * US-1.1.1 - Sprint 1 Quality Assurance
 *
 * Tests for: authenticateJWT, optionalAuth, authorizeAdmin, authorizeModerator
 * Coverage Target: 100% branch coverage for middleware/auth.ts
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  authenticateJWT,
  optionalAuth,
  authorizeAdmin,
  authorizeModerator,
} from '../src/middleware/auth';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');
const mockJwt = jwt as jest.Mocked<typeof jwt>;

// Helper to create mock Request
const createMockRequest = (authHeader?: string): Partial<Request> => ({
  headers: authHeader ? { authorization: authHeader } : {},
  user: undefined,
});

// Helper to create mock Response
const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Helper to create mock NextFunction
const createMockNext = (): NextFunction => jest.fn();

describe('JWT Authentication Middleware', () => {
  const MOCK_SECRET = 'test-jwt-secret-key';
  const VALID_TOKEN = 'valid.jwt.token';
  const DECODED_USER = {
    userId: 'user-123',
    email: 'test@example.com',
    role: 'user',
    iat: 1234567890,
    exp: 9999999999,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = MOCK_SECRET;
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('authenticateJWT', () => {
    describe('Token Validation', () => {
      it('GIVEN valid Bearer token WHEN authenticateJWT THEN attaches user and calls next', () => {
        // Arrange
        const req = createMockRequest(`Bearer ${VALID_TOKEN}`) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        mockJwt.verify.mockReturnValue(DECODED_USER as any);

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(mockJwt.verify).toHaveBeenCalledWith(VALID_TOKEN, MOCK_SECRET);
        expect(req.user).toEqual({
          userId: 'user-123',
          email: 'test@example.com',
          role: 'user',
        });
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });

      it('GIVEN no Authorization header WHEN authenticateJWT THEN returns 401', () => {
        // Arrange
        const req = createMockRequest() as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Unauthorized',
          message: 'No token provided',
          hint: 'Incluir header: Authorization: Bearer <token>',
        });
        expect(next).not.toHaveBeenCalled();
      });

      it('GIVEN malformatted token (no Bearer prefix) WHEN authenticateJWT THEN returns 401', () => {
        // Arrange
        const req = createMockRequest(VALID_TOKEN) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Unauthorized',
          message: 'Token malformatted',
          hint: 'Formato esperado: "Bearer <token>"',
        });
        expect(next).not.toHaveBeenCalled();
      });

      it('GIVEN malformatted token (Basic instead of Bearer) WHEN authenticateJWT THEN returns 401', () => {
        // Arrange
        const req = createMockRequest(`Basic ${VALID_TOKEN}`) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: 'Unauthorized',
            message: 'Token malformatted',
          })
        );
      });

      it('GIVEN malformatted token (extra parts) WHEN authenticateJWT THEN returns 401', () => {
        // Arrange
        const req = createMockRequest(`Bearer ${VALID_TOKEN} extra`) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });

    describe('Token Errors', () => {
      it('GIVEN invalid token WHEN authenticateJWT THEN returns 403 with details', () => {
        // Arrange
        const req = createMockRequest(`Bearer invalid-token`) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        // Create error with proper message property
        const jwtError = Object.assign(new Error('jwt malformed'), {
          name: 'JsonWebTokenError',
        });
        Object.setPrototypeOf(jwtError, jwt.JsonWebTokenError.prototype);

        mockJwt.verify.mockImplementation(() => {
          throw jwtError;
        });

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Forbidden',
          message: 'Invalid token',
          details: 'jwt malformed',
        });
        expect(next).not.toHaveBeenCalled();
      });

      it('GIVEN expired token WHEN authenticateJWT THEN returns 403 with expiredAt', () => {
        // Arrange
        const req = createMockRequest(`Bearer expired-token`) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        const expiredAt = new Date('2024-01-01');
        // Create error with proper expiredAt property
        const expiredError = Object.assign(new Error('jwt expired'), {
          name: 'TokenExpiredError',
          expiredAt: expiredAt,
        });
        Object.setPrototypeOf(expiredError, jwt.TokenExpiredError.prototype);

        mockJwt.verify.mockImplementation(() => {
          throw expiredError;
        });

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Forbidden',
          message: 'Token expired',
          expiredAt: expiredAt,
        });
      });

      it('GIVEN JWT_SECRET not configured WHEN authenticateJWT THEN returns 500', () => {
        // Arrange
        delete process.env.JWT_SECRET;
        const req = createMockRequest(`Bearer ${VALID_TOKEN}`) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Internal Server Error',
          message: 'Authentication failed',
        });
      });

      it('GIVEN unknown error WHEN authenticateJWT THEN returns 500', () => {
        // Arrange
        const req = createMockRequest(`Bearer ${VALID_TOKEN}`) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        mockJwt.verify.mockImplementation(() => {
          throw new Error('Unknown error');
        });

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Internal Server Error',
          message: 'Authentication failed',
        });
      });
    });

    describe('User Data Extraction', () => {
      it('GIVEN token with admin role WHEN authenticateJWT THEN extracts role correctly', () => {
        // Arrange
        const req = createMockRequest(`Bearer ${VALID_TOKEN}`) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        mockJwt.verify.mockReturnValue({
          ...DECODED_USER,
          role: 'admin',
        } as any);

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(req.user?.role).toBe('admin');
      });

      it('GIVEN token without role WHEN authenticateJWT THEN user.role is undefined', () => {
        // Arrange
        const req = createMockRequest(`Bearer ${VALID_TOKEN}`) as Request;
        const res = createMockResponse() as Response;
        const next = createMockNext();

        mockJwt.verify.mockReturnValue({
          userId: 'user-123',
          email: 'test@example.com',
          iat: 1234567890,
          exp: 9999999999,
        } as any);

        // Act
        authenticateJWT(req, res, next);

        // Assert
        expect(req.user?.role).toBeUndefined();
      });
    });
  });

  describe('optionalAuth', () => {
    it('GIVEN no token WHEN optionalAuth THEN calls next without user', () => {
      // Arrange
      const req = createMockRequest() as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('GIVEN valid token WHEN optionalAuth THEN attaches user and calls next', () => {
      // Arrange
      const req = createMockRequest(`Bearer ${VALID_TOKEN}`) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      mockJwt.verify.mockReturnValue(DECODED_USER as any);

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
      });
      expect(next).toHaveBeenCalled();
    });

    it('GIVEN invalid token WHEN optionalAuth THEN calls next without user (no error)', () => {
      // Arrange
      const req = createMockRequest(`Bearer invalid-token`) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      mockJwt.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('jwt malformed');
      });

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('GIVEN expired token WHEN optionalAuth THEN calls next without user', () => {
      // Arrange
      const req = createMockRequest(`Bearer expired-token`) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      mockJwt.verify.mockImplementation(() => {
        throw new jwt.TokenExpiredError('jwt expired', new Date());
      });

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it('GIVEN malformatted header WHEN optionalAuth THEN calls next without user', () => {
      // Arrange
      const req = createMockRequest('InvalidFormat') as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it('GIVEN JWT_SECRET not configured WHEN optionalAuth THEN calls next without user', () => {
      // Arrange
      delete process.env.JWT_SECRET;
      const req = createMockRequest(`Bearer ${VALID_TOKEN}`) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorizeAdmin', () => {
    it('GIVEN user with admin role WHEN authorizeAdmin THEN calls next', () => {
      // Arrange
      const req = createMockRequest() as Request;
      req.user = { userId: 'admin-1', email: 'admin@test.com', role: 'admin' };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      authorizeAdmin(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('GIVEN user with non-admin role WHEN authorizeAdmin THEN returns 403', () => {
      // Arrange
      const req = createMockRequest() as Request;
      req.user = { userId: 'user-1', email: 'user@test.com', role: 'user' };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      authorizeAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Forbidden',
        message: 'Admin access required',
        hint: 'Only administrators can perform this action',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('GIVEN no user (unauthenticated) WHEN authorizeAdmin THEN returns 401', () => {
      // Arrange
      const req = createMockRequest() as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      authorizeAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    });

    it('GIVEN user without role WHEN authorizeAdmin THEN returns 403', () => {
      // Arrange
      const req = createMockRequest() as Request;
      req.user = { userId: 'user-1', email: 'user@test.com' };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      authorizeAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('authorizeModerator', () => {
    it('GIVEN user with admin role WHEN authorizeModerator THEN calls next', () => {
      // Arrange
      const req = createMockRequest() as Request;
      req.user = { userId: 'admin-1', email: 'admin@test.com', role: 'admin' };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      authorizeModerator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('GIVEN user with moderator role WHEN authorizeModerator THEN calls next', () => {
      // Arrange
      const req = createMockRequest() as Request;
      req.user = { userId: 'mod-1', email: 'mod@test.com', role: 'moderator' };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      authorizeModerator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('GIVEN user with regular role WHEN authorizeModerator THEN returns 403', () => {
      // Arrange
      const req = createMockRequest() as Request;
      req.user = { userId: 'user-1', email: 'user@test.com', role: 'user' };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      authorizeModerator(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Forbidden',
        message: 'Moderator or admin access required',
      });
    });

    it('GIVEN no user WHEN authorizeModerator THEN returns 401', () => {
      // Arrange
      const req = createMockRequest() as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      // Act
      authorizeModerator(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});

describe('JWT Authentication: Security Scenarios', () => {
  const MOCK_SECRET = 'test-jwt-secret-key';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = MOCK_SECRET;
  });

  it('GIVEN tampered token WHEN authenticateJWT THEN returns 403', () => {
    // Arrange
    const req = createMockRequest('Bearer tampered.token.here') as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    mockJwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid signature');
    });

    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Forbidden',
        message: 'Invalid token',
      })
    );
  });

  it('GIVEN token signed with different secret WHEN authenticateJWT THEN returns 403', () => {
    // Arrange
    const req = createMockRequest('Bearer wrong-secret-token') as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    mockJwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid signature');
    });

    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('GIVEN SQL injection in token WHEN authenticateJWT THEN handles safely', () => {
    // Arrange - token with spaces is caught at format validation (401)
    // Token without spaces reaches jwt.verify and fails (403)
    const maliciousToken = "Bearer 'OR'1'='1";
    const req = createMockRequest(maliciousToken) as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    const jwtError = Object.assign(new Error('jwt malformed'), {
      name: 'JsonWebTokenError',
    });
    Object.setPrototypeOf(jwtError, jwt.JsonWebTokenError.prototype);

    mockJwt.verify.mockImplementation(() => {
      throw jwtError;
    });

    // Act
    authenticateJWT(req, res, next);

    // Assert - malicious token rejected as invalid JWT
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('JWT Authentication: Edge Cases', () => {
  const MOCK_SECRET = 'test-jwt-secret-key';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = MOCK_SECRET;
  });

  it('GIVEN empty Bearer token WHEN authenticateJWT THEN handles gracefully', () => {
    // Arrange
    const req = createMockRequest('Bearer ') as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    // Act
    authenticateJWT(req, res, next);

    // Assert - empty token after split results in parts.length === 2 but empty token
    // The jwt.verify will fail
    expect(res.status).toHaveBeenCalled();
  });

  it('GIVEN Authorization header with only Bearer WHEN authenticateJWT THEN returns 401', () => {
    // Arrange
    const req = createMockRequest('Bearer') as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('GIVEN lowercase bearer WHEN authenticateJWT THEN returns 401 (case sensitive)', () => {
    // Arrange
    const req = createMockRequest('bearer valid-token') as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('GIVEN whitespace around token WHEN authenticateJWT THEN handles correctly', () => {
    // Arrange - extra spaces are handled by split
    const req = createMockRequest('Bearer   token-with-spaces') as Request;
    const res = createMockResponse() as Response;
    const next = createMockNext();

    // Act
    authenticateJWT(req, res, next);

    // Assert - will result in parts.length > 2
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
