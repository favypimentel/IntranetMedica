import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-gray-200/80 bg-white/50 backdrop-blur-xs py-6 px-6 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary-600" />
          <span>
            © {new Date().getFullYear()} Intranet Médica — Plataforma de Formación Continua Acreditada
          </span>
        </div>

        <div className="flex items-center space-x-6 text-xs font-medium">
          <Link to="/courses" className="hover:text-primary-600 transition-colors">
            Cursos
          </Link>
          <Link to="/news" className="hover:text-primary-600 transition-colors">
            Noticias Científicas
          </Link>
          <Link to="/membership" className="hover:text-primary-600 transition-colors">
            Planes de Membresía
          </Link>
          <span className="text-gray-400">v1.0 (BDD/SDD)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
