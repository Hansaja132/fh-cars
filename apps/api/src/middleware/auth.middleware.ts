import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './error-handler';
import { prisma } from '../config/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'ADMIN' | 'EDITOR';
  };
}

export const authenticateJwt = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization header missing or invalid format', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: number;
      email: string;
      role: 'ADMIN' | 'EDITOR';
    };

    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or account deactivated', 401, 'UNAUTHORIZED');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as 'ADMIN' | 'EDITOR',
    };

    next();
  } catch (err: any) {
    if (err instanceof AppError) return next(err);
    return next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }
};

export const requireRole = (roles: ('ADMIN' | 'EDITOR')[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: insufficient permissions', 403, 'FORBIDDEN'));
    }
    next();
  };
};
