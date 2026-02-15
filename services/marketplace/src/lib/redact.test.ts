/**
 * Redaction Utility Test Cases
 * Demonstrates that sensitive data is properly redacted
 */

import { redactSensitiveData, redactError, REDACTED_FIELDS } from './redact';

describe('Sensitive Data Redaction', () => {
  describe('Field-based redaction', () => {
    it('should redact password field', () => {
      const data = { username: 'john', password: 'secret123' };
      const redacted = redactSensitiveData(data);
      expect(redacted.password).toBe('***REDACTED***');
      expect(redacted.username).toBe('john');
    });

    it('should redact token field', () => {
      const data = { userId: '123', token: 'jwt-token-xyz' };
      const redacted = redactSensitiveData(data);
      expect(redacted.token).toBe('***REDACTED***');
    });

    it('should redact accessToken field', () => {
      const data = { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' };
      const redacted = redactSensitiveData(data);
      expect(redacted.accessToken).toBe('***REDACTED***');
    });

    it('should redact apiKey field', () => {
      const data = { apiKey: 'sk-1234567890abcdef' };
      const redacted = redactSensitiveData(data);
      expect(redacted.apiKey).toBe('***REDACTED***');
    });

    it('should redact authorization header', () => {
      const data = { authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI...' };
      const redacted = redactSensitiveData(data);
      expect(redacted.authorization).toBe('***REDACTED***');
    });
  });

  describe('Pattern-based redaction', () => {
    it('should redact JWT tokens in string values', () => {
      const data = {
        message: 'Token used: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
      };
      const redacted = redactSensitiveData(data);
      expect(redacted.message).toContain('***REDACTED***');
      expect(redacted.message).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    });

    it('should redact Bearer tokens in values', () => {
      const data = {
        header: 'Authorization: Bearer token123abc456def'
      };
      const redacted = redactSensitiveData(data);
      expect(redacted.header).toContain('***REDACTED***');
    });

    it('should redact Basic auth in values', () => {
      const data = {
        auth: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
      };
      const redacted = redactSensitiveData(data);
      expect(redacted.auth).toContain('***REDACTED***');
    });
  });

  describe('Recursive redaction', () => {
    it('should redact nested objects', () => {
      const data = {
        user: {
          id: '123',
          email: 'user@example.com',
          password: 'secret123',
          profile: {
            apiKey: 'sk-xyz'
          }
        }
      };
      const redacted = redactSensitiveData(data);
      expect(redacted.user.password).toBe('***REDACTED***');
      expect(redacted.user.profile.apiKey).toBe('***REDACTED***');
      expect(redacted.user.email).toBe('user@example.com');
    });

    it('should redact items in arrays', () => {
      const data = {
        tokens: [
          { name: 'access', token: 'abc123' },
          { name: 'refresh', token: 'def456' }
        ]
      };
      const redacted = redactSensitiveData(data);
      expect(redacted.tokens[0].token).toBe('***REDACTED***');
      expect(redacted.tokens[1].token).toBe('***REDACTED***');
    });

    it('should handle deeply nested structures', () => {
      const data = {
        level1: {
          level2: {
            level3: {
              password: 'secret'
            }
          }
        }
      };
      const redacted = redactSensitiveData(data);
      expect(redacted.level1.level2.level3.password).toBe('***REDACTED***');
    });
  });

  describe('Error redaction', () => {
    it('should redact error message with sensitive data', () => {
      const error = new Error('Authentication failed with token: xyz123abc');
      const redacted = redactError(error);
      expect(redacted.message).not.toContain('xyz123abc');
      expect(redacted.message).toContain('***REDACTED***');
    });

    it('should preserve error stack trace while redacting sensitive data', () => {
      const error = new Error('Failed to connect with password: secret123');
      const redacted = redactError(error);
      expect(redacted.stack).toBeDefined();
      expect(redacted.stack).not.toContain('secret123');
    });
  });

  describe('Edge cases', () => {
    it('should handle null and undefined', () => {
      expect(redactSensitiveData(null)).toBeNull();
      expect(redactSensitiveData(undefined)).toBeUndefined();
    });

    it('should handle empty objects', () => {
      const redacted = redactSensitiveData({});
      expect(redacted).toEqual({});
    });

    it('should handle primitive values', () => {
      expect(redactSensitiveData(123)).toBe(123);
      expect(redactSensitiveData('plain string')).toBe('plain string');
      expect(redactSensitiveData(true)).toBe(true);
    });

    it('should prevent infinite recursion', () => {
      const data: any = { a: 1 };
      data.self = data; // Create circular reference
      // Should not throw - function has depth limit
      expect(() => redactSensitiveData(data)).not.toThrow();
    });
  });

  describe('Field list', () => {
    it('should include all expected sensitive fields', () => {
      const expectedFields = [
        'password',
        'token',
        'apiKey',
        'secret',
        'authorization'
      ];
      expectedFields.forEach(field => {
        expect(REDACTED_FIELDS.map(f => f.toLowerCase())).toContain(field.toLowerCase());
      });
    });
  });

  describe('Real-world scenarios', () => {
    it('should redact database connection string', () => {
      const data = {
        connectionString: 'postgresql://user:password123@localhost:5432/mydb'
      };
      const redacted = redactSensitiveData(data);
      expect(redacted.connectionString).toBe('***REDACTED***');
    });

    it('should redact AWS credentials', () => {
      const data = {
        awsAccessKeyId: 'AKIAIOSFODNN7EXAMPLE',
        awsSecretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
      };
      const redacted = redactSensitiveData(data);
      expect(redacted.awsAccessKeyId).toBe('***REDACTED***');
      expect(redacted.awsSecretAccessKey).toBe('***REDACTED***');
    });

    it('should redact complete request/response logs', () => {
      const logEntry = {
        timestamp: '2026-02-11T12:00:00Z',
        level: 'error',
        message: 'Login failed',
        userId: 'user-123',
        requestData: {
          email: 'user@example.com',
          password: 'myPassword123'
        },
        response: {
          status: 401,
          error: 'Invalid credentials',
          token: 'jwt-token-xyz'
        }
      };
      const redacted = redactSensitiveData(logEntry);
      expect(redacted.requestData.password).toBe('***REDACTED***');
      expect(redacted.response.token).toBe('***REDACTED***');
      expect(redacted.userId).toBe('user-123');
    });
  });
});
