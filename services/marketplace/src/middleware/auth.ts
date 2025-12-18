import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * Middleware JWT Authentication
 * Valida token JWT gerado pelo iaMenu Core (Java)
 * Token partilhado entre Core e Services Node.js
 */
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from header: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
        hint: 'Incluir header: Authorization: Bearer <token>'
      });
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token malformatted',
        hint: 'Formato esperado: "Bearer <token>"'
      });
      return;
    }

    const token = parts[1];

    // Validate token
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not configured in environment variables');
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role?: string;
      iat: number;
      exp: number;
    };

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    // Continue to next middleware/route
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid token',
        details: error.message
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Token expired',
        expiredAt: error.expiredAt
      });
      return;
    }

    // Other errors
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

/**
 * Optional auth middleware
 * Não falha se token não existe, mas adiciona user se token válido
 * Útil para rotas públicas mas com features extras para autenticados
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // No token, continue sem user
      next();
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1];
      const JWT_SECRET = process.env.JWT_SECRET;

      if (JWT_SECRET) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            email: string;
            role?: string;
          };

          req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
          };
        } catch {
          // Token inválido, ignora e continua sem user
        }
      }
    }

    next();
  } catch (error) {
    // Qualquer erro, continua sem user
    next();
  }
};
