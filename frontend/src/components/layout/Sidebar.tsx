import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Newspaper,
  CreditCard,
  User,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { getStoredEnrollments, getStoredMembership } from '../../services/mockData';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/my-courses', label: 'Mis Cursos', icon: GraduationCap, badgeKey: 'enrolledCount' },
  { path: '/courses', label: 'Catálogo de Cursos', icon: BookOpen },
  { path: '/news', label: 'Noticias Médicas', icon: Newspaper },
  { path: '/membership', label: 'Membresía & Pagos', icon: CreditCard },
  { path: '/profile', label: 'Perfil Profesional', icon: User }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user } = useAuthStore();
  const enrollments = getStoredEnrollments(user?.id || 1);
  const membership = getStoredMembership(user?.id || 1);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200/80 overflow-y-auto z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="p-4 space-y-6">
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Menú</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Doctor Brief Info Badge */}
          <div className="p-3.5 bg-gradient-to-br from-primary-50/80 via-primary-50/40 to-secondary-50/40 rounded-2xl border border-primary-100/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                {user?.firstName?.charAt(0) || 'D'}
                {user?.lastName?.charAt(0) || 'R'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">
                  Dr. {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {user?.doctor?.specialty || 'Cardiología'}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-700 font-medium">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>{user?.doctor?.licenseNumber || 'Col. Verificado'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Navegación
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const count =
                item.badgeKey === 'enrolledCount' ? enrollments.length : null;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                        : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-600'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {count !== null && count > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-primary-50 text-primary-700'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Membership Widget */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Membresía Médica</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 uppercase">
                {membership?.status || 'Activa'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              Acceso ilimitado a todos los cursos y certificaciones.
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-gray-400">Vigencia:</span>
              <span className="font-semibold text-gray-700">
                {membership?.daysRemaining || 19} días restantes
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
