import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Newspaper, CreditCard, User, GraduationCap } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/my-courses', label: 'Mis Cursos', icon: GraduationCap },
  { path: '/courses', label: 'Catálogo', icon: BookOpen },
  { path: '/news', label: 'Noticias', icon: Newspaper },
  { path: '/membership', label: 'Membresía', icon: CreditCard },
  { path: '/profile', label: 'Perfil', icon: User }
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
