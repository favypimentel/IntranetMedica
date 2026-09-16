import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { Button } from '../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Por favor ingrese un email válido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'doctor@example.com',
      password: 'SecurePass123!'
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');

      const response = await authService.login(data);
      const { userId, email, firstName, lastName, role, token, refreshToken, doctor } =
        response.data;

      login(
        {
          id: userId,
          email,
          firstName,
          lastName,
          role,
          doctor: doctor || {
            licenseNumber: 'COL-28391-MD',
            specialty: 'Cardiología',
            institution: 'Hospital General Universitario',
            verified: true
          }
        },
        token,
        refreshToken
      );

      addToast({
        type: 'success',
        title: '¡Sesión Iniciada!',
        message: `Bienvenido de nuevo, Dr. ${firstName || 'Médico'}.`
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          'Email o contraseña incorrectos. Verifique sus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (role: 'doctor' | 'cardiologist') => {
    if (role === 'doctor') {
      setValue('email', 'doctor@example.com');
      setValue('password', 'SecurePass123!');
    } else {
      setValue('email', 'dra.gonzalez@cardio.med');
      setValue('password', 'SecurePass123!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex items-center justify-center p-4 selection:bg-primary-100 selection:text-primary-900">
      <div className="max-w-md w-full space-y-6">
        {/* Logo Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="h-7 w-7" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Intranet<span className="text-primary-400">Médica</span>
          </h2>
          <p className="text-xs text-slate-400">
            Plataforma Profesional de Formación Continua
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-7 sm:p-8 border border-gray-100 animate-scale-up space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Acceso a Médicos</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Ingrese con sus credenciales de profesional colegiado
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs leading-relaxed">
              <strong>Error de acceso:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email Profesional
              </label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="doctor@example.com"
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-gray-700"
                >
                  Contraseña
                </label>
                <a href="#" className="text-[11px] text-primary-600 hover:underline font-medium">
                  ¿Olvidó su contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full font-bold shadow-md shadow-primary-600/20 mt-2"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
              <KeyRound className="h-3.5 w-3.5 text-primary-600" />
              <span>Accesos Rápidos de Demostración:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('doctor')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-primary-300 transition-colors text-left"
              >
                Dr. Médico General
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('cardiologist')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-primary-300 transition-colors text-left"
              >
                Dra. Cardióloga
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              ¿No posee una cuenta médica habilitada?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
                Registrarse aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
