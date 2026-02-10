import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export const rlsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as {
      userId: string;
      email: string;
      role: string;
    };

    await prisma.$executeRawUnsafe(`SET app.current_user_id = '${decoded.userId}'`);
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;

    next();
  } catch (error) {
    console.error('RLS middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const setRLSContext = async (userId: string): Promise<void> => {
  await prisma.$executeRawUnsafe(`SET app.current_user_id = '${userId}'`);
};

export const clearRLSContext = async (): Promise<void> => {
  await prisma.$executeRawUnsafe(`RESET app.current_user_id`);
};
