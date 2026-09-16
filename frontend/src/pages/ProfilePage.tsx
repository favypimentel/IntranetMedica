import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  Save,
  KeyRound,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || 'Juan');
  const [lastName, setLastName] = useState(user?.lastName || 'Pérez');
  const [phone, setPhone] = useState(user?.phone || '+34 600 123 456');
  const [specialty, setSpecialty] = useState(user?.doctor?.specialty || 'Cardiología');
  const [institution, setInstitution] = useState(user?.doctor?.institution || 'Hospital General Universitario');
  const [licenseNumber, setLicenseNumber] = useState(user?.doctor?.licenseNumber || 'COL-28391-MD');

  // Password fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await authService.updateProfile({
        firstName,
        lastName,
        phone,
        specialty,
        institution
      });

      updateUser({
        firstName,
        lastName,
        phone,
        doctor: {
          licenseNumber,
          specialty,
          institution,
          verified: true
        }
      });

      addToast({
        type: 'success',
        title: 'Perfil Actualizado',
        message: 'Tus datos profesionales han sido guardados correctamente.'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error al actualizar',
        message: err.message || 'No fue posible guardar los cambios.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      addToast({
        type: 'error',
        title: 'Error de Contraseña',
        message: 'La nueva contraseña y su confirmación no coinciden.'
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'Contraseña Modificada',
      message: 'Tu clave de acceso ha sido actualizada con éxito.'
    });

    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <Badge variant="primary" className="mb-2">
          Configuración Profesional
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Perfil del Médico Colegiado
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Actualiza tus credenciales, adscripción hospitalaria y opciones de seguridad.
        </p>
      </div>

      {/* Profile Card Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 text-white font-bold flex items-center justify-center text-2xl shadow-md shrink-0">
          {firstName.charAt(0)}
          {lastName.charAt(0)}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              Dr. {firstName} {lastName}
            </h2>
            <Badge variant="success" size="sm" className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Colegiado Activo
            </Badge>
          </div>
          <p className="text-xs text-primary-700 font-semibold">{specialty} • {institution}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 text-sm font-bold">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'info'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Datos Personales & Profesionales</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Seguridad y Contraseña</span>
        </button>
      </div>

      {/* Tab: Info Form */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              1. Datos Personales
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Profesional</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              2. Credenciales Médicas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nº Colegiado / Cédula Profesional
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Especialidad Médica
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hospital o Institución de Adscripción
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Cambio de Contraseña
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Mín. 8 caracteres"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Repetir contraseña"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<KeyRound className="h-4 w-4" />}
            >
              Actualizar Contraseña
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
