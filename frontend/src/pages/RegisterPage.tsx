import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShieldCheck,
  Stethoscope,
  Lock,
  User,
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { Button } from '../components/ui/Button';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(8, 'Número telefónico inválido').optional().or(z.literal('')),
    licenseNumber: z
      .string()
      .min(4, 'El número de colegiatura / cédula médica es requerido'),
    specialty: z.string().min(2, 'Seleccione o especifique su especialidad médica'),
    institution: z.string().optional().or(z.literal('')),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
      .regex(/\d/, 'Debe contener al menos un número')
      .regex(/[@$!%*?&#]/, 'Debe contener al menos un carácter especial (@$!%*?&#)'),
    confirmPassword: z.string().min(1, 'Confirme su contraseña'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Debe aceptar los términos y condiciones de la comunidad médica' })
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const MEDICAL_SPECIALTIES = [
  'Cardiología',
  'Pediatría',
  'Neurología',
  'Cirugía General',
  'Infectología',
  'Endocrinología',
  'Medicina Interna',
  'Medicina de Urgencias',
  'Ginecología y Obstetricia',
  'Oncología Médica',
  'Traumatología y Ortopedia',
  'Radiología y Diagnóstico por Imagen',
  'Anestesiología'
];

export const RegisterPage: React.FC = () => {
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      specialty: 'Cardiología',
      acceptTerms: true
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError('');

      const response = await authService.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        licenseNumber: data.licenseNumber,
        specialty: data.specialty,
        institution: data.institution || undefined
      });

      const { userId, email, firstName, lastName, role, token, refreshToken, doctor } =
        response.data;

      login(
        {
          id: userId,
          email,
          firstName,
          lastName,
          role,
          phone: data.phone || undefined,
          doctor: doctor || {
            licenseNumber: data.licenseNumber,
            specialty: data.specialty,
            institution: data.institution || '',
            verified: true
          }
        },
        token,
        refreshToken
      );

      addToast({
        type: 'success',
        title: '¡Registro Exitoso!',
        message: `Bienvenido a la Intranet Médica, Dr. ${firstName} ${lastName}.`
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          'Error al registrar la cuenta. Verifique los datos ingresados.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setValue('firstName', 'Ana');
    setValue('lastName', 'Rodríguez Silva');
    setValue('email', 'dra.rodriguez@hospitalmed.org');
    setValue('phone', '+34 611 234 567');
    setValue('licenseNumber', 'COL-58291-MED');
    setValue('specialty', 'Cardiología');
    setValue('institution', 'Hospital Universitario Central');
    setValue('password', 'Doctor2026!');
    setValue('confirmPassword', 'Doctor2026!');
    setValue('acceptTerms', true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-scale-up">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-8 text-white text-center relative">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md items-center justify-center mb-3 shadow-inner">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Registro de Profesional Médico
            </h1>
            <p className="text-primary-100 text-xs sm:text-sm mt-1 max-w-md mx-auto">
              Ingrese sus datos personales y credenciales colegiadas para habilitar su acceso a la plataforma.
            </p>

            <button
              type="button"
              onClick={handleFillDemo}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-3 py-1 rounded-full transition-colors backdrop-blur-sm"
            >
              Autocompletar Demo
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs sm:text-sm">
                <strong>Error en el registro:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Sección 1: Datos Personales */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-900 font-bold text-sm">
                  <User className="h-4 w-4 text-primary-600" />
                  <span>1. Información Personal</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nombre(s) *
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Ej. Juan Carlos"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-rose-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Apellido(s) *
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Ej. Pérez García"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-rose-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Profesional *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="doctor@hospital.org"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="+34 600 000 000"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección 2: Credenciales Profesionales */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-900 font-bold text-sm">
                  <ShieldCheck className="h-4 w-4 text-secondary-600" />
                  <span>2. Credenciales Médicas y Colegiatura</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nº Colegiado / Cédula Profesional *
                    </label>
                    <input
                      {...register('licenseNumber')}
                      type="text"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                      placeholder="Ej. COL-12345"
                    />
                    {errors.licenseNumber && (
                      <p className="mt-1 text-xs text-rose-600">{errors.licenseNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Especialidad Médica *
                    </label>
                    <select
                      {...register('specialty')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all bg-white"
                    >
                      {MEDICAL_SPECIALTIES.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    {errors.specialty && (
                      <p className="mt-1 text-xs text-rose-600">{errors.specialty.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Institución / Hospital de Trabajo
                  </label>
                  <input
                    {...register('institution')}
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                    placeholder="Ej. Hospital General Universitario"
                  />
                </div>
              </div>

              {/* Sección 3: Seguridad de la Cuenta */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-900 font-bold text-sm">
                  <Lock className="h-4 w-4 text-primary-600" />
                  <span>3. Contraseña y Seguridad</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Contraseña *
                    </label>
                    <input
                      {...register('password')}
                      type="password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Mín. 8 caracteres (A-z, 0-9, #)"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirmar Contraseña *
                    </label>
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Repita su contraseña"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Términos y Condiciones */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    {...register('acceptTerms')}
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    Certifico que soy profesional de la salud en ejercicio y acepto los{' '}
                    <a href="#" className="text-primary-600 underline font-medium">
                      términos del código deontológico
                    </a>{' '}
                    y la política de privacidad de Intranet Médica.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-xs text-rose-600">{errors.acceptTerms.message}</p>
                )}
              </div>

              {/* Botón Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full font-bold shadow-lg shadow-primary-600/25"
              >
                Completar Registro Médico
              </Button>
            </form>

            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-600">
                ¿Ya posee una cuenta médica habilitada?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
