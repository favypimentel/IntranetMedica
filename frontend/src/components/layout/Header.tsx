import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut,
  User as UserIcon,
  Bell,
  CheckCircle2,
  Sparkles,
  Menu,
  ShieldCheck,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Badge } from '../ui/Badge';
import { getStoredMembership } from '../../services/mockData';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const membership = getStoredMembership(user?.id || 1);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'Nuevo Curso Disponible',
      desc: 'Actualización en Cardiología Clínica 2026 ya está abierto para inscripción.',
      time: 'Hace 2 horas',
      read: false
    },
    {
      id: 2,
      title: 'Membresía Activa',
      desc: `Tu membresía médica está al día. Quedan ${membership?.daysRemaining || 19} días de acceso continuo.`,
      time: 'Hoy',
      read: true
    }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 fixed top-0 left-0 right-0 z-30 h-16 transition-all">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 text-base sm:text-lg tracking-tight">
                  Intranet<span className="text-primary-600">Médica</span>
                </span>
                <Badge variant="primary" size="sm" className="hidden sm:inline-flex text-[10px]">
                  PRO
                </Badge>
              </div>
              <p className="text-[10px] text-gray-400 font-medium hidden sm:block -mt-1">
                Portal de Educación Médica Continua
              </p>
            </div>
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Membership Quick Status Pill */}
          <Link
            to="/membership"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold transition-colors shadow-2xs"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Membresía Activa</span>
            <span className="text-emerald-600/80 font-normal">({membership?.daysRemaining || 19}d)</span>
          </Link>

          {/* Quick Courses link for tablet/desktop */}
          <Link
            to="/courses"
            className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Catálogo</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              title="Notificaciones"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-600 ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-scale-up">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900">Notificaciones</h4>
                  <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    2 nuevas
                  </span>
                </div>
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3.5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 pt-2 border-t border-gray-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Cerrar notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Doctor Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {user?.firstName?.charAt(0) || 'D'}
                {user?.lastName?.charAt(0) || 'R'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-tight">
                  Dr. {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-primary-600 font-medium">
                  {user?.doctor?.specialty || 'Médico Colegiado'}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-scale-up">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">
                    Dr. {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {user?.doctor?.licenseNumber || 'Col. Verificado'}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors text-left"
                  >
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span>Mi Perfil Profesional</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/membership');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors text-left"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Membresía y Pagos</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
