import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { User } from '../models';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role_id: number;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
      role_id: number;
    };

    // Verificar que el usuario existe
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.is_active) {
      throw new AppError('User not found or inactive', 401);
    }

    // Agregar usuario al request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role_id: decoded.role_id
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (...allowedRoles: number[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!allowedRoles.includes(req.user.role_id)) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }

    next();
  };
};
