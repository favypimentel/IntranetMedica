import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Doctor, Role } from '../models';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Generar tokens JWT
const generateTokens = (userId: number, email: string, roleId: number) => {
  const accessToken = jwt.sign(
    { userId, email, role_id: roleId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, email, role_id: roleId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

// Registro de nuevo usuario médico
export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      licenseNumber,
      specialty,
      institution
    } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Verificar si el número de colegiatura ya existe
    const existingDoctor = await Doctor.findOne({ where: { license_number: licenseNumber } });
    if (existingDoctor) {
      throw new AppError('License number already registered', 409);
    }

    // Hash de la contraseña
    const passwordHash = await User.hashPassword(password);

    // Crear usuario (rol 1 = doctor por defecto)
    const user = await User.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      role_id: 1 // Doctor
    });

    // Crear registro de doctor
    await Doctor.create({
      user_id: user.id,
      license_number: licenseNumber,
      specialty,
      institution
    });

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role_id);

    res.status(201).json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        token: accessToken,
        refreshToken
      },
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario con rol y doctor
    const user = await User.findOne({
      where: { email },
      include: [
        { model: Role, as: 'role' },
        { model: Doctor, as: 'doctor' }
      ]
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verificar que el usuario esté activo
    if (!user.is_active) {
      throw new AppError('Account is inactive', 403);
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role_id);

    res.status(200).json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: (user as any).role?.name || 'doctor',
        token: accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
export const refreshToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new AppError('Refresh token required', 400);
    }

    // Verificar refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      userId: number;
      email: string;
      role_id: number;
    };

    // Verificar que el usuario existe y está activo
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.is_active) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generar nuevos tokens
    const tokens = generateTokens(decoded.userId, decoded.email, decoded.role_id);

    res.status(200).json({
      success: true,
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid refresh token', 401));
    } else {
      next(error);
    }
  }
};

// Logout (cliente debe eliminar el token)
export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // En una implementación más avanzada, aquí se agregaría el token a una blacklist en Redis
    res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener usuario autenticado
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.user!.id, {
      include: [
        { model: Role, as: 'role' },
        { model: Doctor, as: 'doctor' }
      ]
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: (user as any).role?.name || 'doctor',
        isActive: user.is_active,
        doctor: (user as any).doctor ? {
          licenseNumber: (user as any).doctor.license_number,
          specialty: (user as any).doctor.specialty,
          institution: (user as any).doctor.institution,
          verified: (user as any).doctor.verified
        } : null,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};
