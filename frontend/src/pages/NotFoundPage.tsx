import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl space-y-6 animate-scale-up">
        <div className="h-20 w-20 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto shadow-inner">
          <Stethoscope className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black text-primary-600 tracking-wider uppercase">
            Error 404 • Diagnóstico No Encontrado
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Página No Localizada
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            La ruta o recurso clínico solicitado no existe o ha sido reubicado en la intranet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full sm:w-auto font-bold" leftIcon={<Home className="h-4 w-4" />}>
              Ir al Dashboard
            </Button>
          </Link>
          <Link to="/courses" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
