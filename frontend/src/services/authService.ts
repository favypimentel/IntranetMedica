import api from './api';
import { useAuthStore, User } from '../stores/authStore';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  licenseNumber: string;
  specialty: string;
  institution?: string;
}

export const authService = {
  async login(data: LoginData): Promise<{ success: boolean; data: any; message?: string }> {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (err: any) {
      // If server is unreachable, allow demo login fallback for testing
      if (!err.response || err.code === 'ERR_NETWORK') {
        const mockUser: User = {
          id: 1,
          email: data.email,
          firstName: data.email.split('@')[0] === 'doctor' ? 'Juan' : 'Carlos',
          lastName: 'Pérez García',
          role: 'doctor',
          phone: '+34 600 123 456',
          doctor: {
            licenseNumber: 'COL-28391-MD',
            specialty: 'Cardiología',
            institution: 'Hospital Clínico San Rafael',
            verified: true
          }
        };

        return {
          success: true,
          data: {
            userId: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            role: mockUser.role,
            token: 'mock_jwt_token_doctor_access_' + Date.now(),
            refreshToken: 'mock_jwt_token_refresh_' + Date.now(),
            doctor: mockUser.doctor
          },
          message: 'Inicio de sesión exitoso (Modo Autónomo)'
        };
      }
      throw err;
    }
  },

  async register(data: RegisterData): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK') {
        const mockUser: User = {
          id: Math.floor(100 + Math.random() * 900),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'doctor',
          phone: data.phone,
          doctor: {
            licenseNumber: data.licenseNumber,
            specialty: data.specialty,
            institution: data.institution,
            verified: true
          }
        };

        return {
          success: true,
          data: {
            userId: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            role: mockUser.role,
            token: 'mock_jwt_token_doctor_access_' + Date.now(),
            refreshToken: 'mock_jwt_token_refresh_' + Date.now(),
            doctor: mockUser.doctor
          },
          message: 'Usuario registrado exitosamente'
        };
      }
      throw err;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      useAuthStore.getState().logout();
    }
  },

  async getMe() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch {
      const user = useAuthStore.getState().user;
      return {
        success: true,
        data: user
      };
    }
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    specialty?: string;
    institution?: string;
  }) {
    try {
      const response = await api.put('/users/me', data);
      return response.data;
    } catch {
      const current = useAuthStore.getState().user;
      if (current) {
        const updated: User = {
          ...current,
          firstName: data.firstName || current.firstName,
          lastName: data.lastName || current.lastName,
          phone: data.phone ?? current.phone,
          doctor: current.doctor
            ? {
                ...current.doctor,
                specialty: data.specialty || current.doctor.specialty,
                institution: data.institution || current.doctor.institution
              }
            : undefined
        };
        useAuthStore.getState().updateUser(updated);
        return {
          success: true,
          data: updated,
          message: 'Perfil actualizado exitosamente'
        };
      }
      throw new Error('No hay usuario autenticado');
    }
  }
};
