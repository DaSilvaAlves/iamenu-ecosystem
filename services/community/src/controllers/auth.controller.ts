import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Auth Controller
 * Handles authentication endpoints
 */
export class AuthController {
  /**
   * GET /api/v1/community/auth/test-token
   * Generate test JWT token for development
   *
   * WARNING: This endpoint should ONLY exist in development!
   * Remove before production deployment.
   */
  async generateTestToken(req: Request, res: Response) {
    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      console.log('DEBUG: JWT_SECRET from env:', JWT_SECRET); // New debug log

      if (!JWT_SECRET) {
        console.error('DEBUG: JWT_SECRET is undefined, returning 500'); // New debug log
        return res.status(500).json({
          success: false,
          error: 'JWT_SECRET not configured in environment variables'
        });
      }

      // Check if we're in production (safety check)
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
          success: false,
          error: 'Test token endpoint disabled in production'
        });
      }

      // Generate test user data
      const testUser = {
        userId: 'test-user-001',
        email: 'eurico@iamenu.pt',
        role: 'admin'
      };

      // Generate JWT token (expires in 24 hours)
      const token = jwt.sign(
        testUser,
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        message: 'Test JWT token generated (valid for 24h)',
        warning: '⚠️ Este endpoint é apenas para DEVELOPMENT! Remover em produção.',
        token: token,
        user: testUser,
        usage: {
          header: 'Authorization: Bearer <token>',
          example: `curl -H "Authorization: Bearer ${token}" http://localhost:3001/api/v1/community/posts`
        }
      });
    } catch (error) {
      console.error('Error generating test token:', error);
      console.error('DEBUG Error details in generateTestToken:', error); // New debug log
      res.status(500).json({
        success: false,
        error: 'Failed to generate test token'
      });
    }
  }
}

export const authController = new AuthController();
