import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getStoredCourses } from '../services/mockData';

export const LandingPage: React.FC = () => {
  const featuredCourses = getStoredCourses().slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-primary-100 selection:text-primary-900">
      {/* Public Navbar */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">
                Intranet<span className="text-primary-600">Médica</span>
              </span>
              <p className="text-[10px] text-gray-400 font-medium -mt-1">
                Portal de Formación Continua
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#cursos" className="hover:text-primary-600 transition-colors">
              Cursos Clínicos
            </a>
            <a href="#beneficios" className="hover:text-primary-600 transition-colors">
              Beneficios
            </a>
            <a href="#precios" className="hover:text-primary-600 transition-colors">
              Membresía
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="shadow-md shadow-primary-600/20">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-primary-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/70 border border-primary-200 text-primary-800 text-xs font-bold animate-fade-in">
              <ShieldCheck className="h-4 w-4 text-primary-600" />
              <span>Plataforma Exclusiva para Profesionales de la Salud</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
              Educación Médica Continua al más alto nivel clínico
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-normal">
              Accede a cursos acreditados por especialistas, mantente al día con los últimos protocolos
              y gestiona tu formación profesional en un solo lugar con nuestra membresía médica.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto text-base px-8 py-4 shadow-xl shadow-primary-600/25"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Registrarse como Médico
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-4">
                  Acceder a mi Cuenta
                </Button>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-gray-200/60 max-w-4xl mx-auto">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary-700">100%</p>
                <p className="text-xs text-gray-500 font-medium">Médicos Colegiados</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary-700">20+</p>
                <p className="text-xs text-gray-500 font-medium">Especialidades</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-secondary-600">24/7</p>
                <p className="text-xs text-gray-500 font-medium">Acceso en Línea</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-secondary-600">99.5%</p>
                <p className="text-xs text-gray-500 font-medium">Satisfacción Clínica</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="cursos" className="py-16 bg-slate-50 border-y border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
            <div>
              <Badge variant="primary" className="mb-2">
                Catálogo Destacado
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Cursos de Actualización Médica
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Contenido desarrollado por jefes de servicio y líderes de opinión.
              </p>
            </div>
            <Link to="/register" className="mt-4 sm:mt-0">
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                Ver todos los cursos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="specialty">{course.category}</Badge>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>
                    <p className="text-xs font-semibold text-primary-700 pt-1">
                      {course.instructor}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                  <span className="text-xs font-medium text-gray-500">
                    Duración: <strong className="text-gray-800">{course.durationHours} hrs</strong>
                  </span>
                  <Link to="/register">
                    <Button size="sm" variant="primary">
                      Inscribirse
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-2">
              Propuesta de Valor
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Diseñado específicamente para el ejercicio médico
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Resolvemos la dispersión de información y facilitamos la acreditación continua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Catálogo Clínico Integral</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Módulos interactivos en cardiología, pediatría, neurología, cirugía, infectología y más,
                con casos clínicos basados en evidencia.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-4">
              <div className="h-12 w-12 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Validación de Colegiatura</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Comunidad médica exclusiva con validación de número de licencia y credenciales
                profesionales durante el registro.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-4">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Noticias y Guías Actualizadas</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Publicaciones científicas del sector, alertas epidemiológicas y novedades
                farmacológicas en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-primary-400 text-xs font-bold uppercase tracking-wider">
              Planes de Membresía
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Suscripción mensual flexible con acceso total
            </h2>
            <p className="text-slate-400 text-sm">
              Sin contratos forzosos. Cancela o renueva cuando lo desees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="p-8 rounded-3xl bg-slate-800/90 border border-slate-700/80 shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Plan Mensual</h3>
                  <Badge variant="primary">Más Popular</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$29.99</span>
                  <span className="text-slate-400 text-sm font-medium">/ mes</span>
                </div>
                <p className="text-xs text-slate-300">
                  Ideal para médicos en formación continua activa.
                </p>

                <ul className="space-y-3 pt-4 text-sm text-slate-300 border-t border-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Acceso ilimitado a todos los cursos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Noticias científicas y análisis de guías</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Seguimiento de progreso interactivo</span>
                  </li>
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <Button size="lg" variant="primary" className="w-full font-bold">
                  Comenzar Plan Mensual
                </Button>
              </Link>
            </div>

            {/* Yearly Plan */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary-950 via-slate-800 to-slate-900 border-2 border-primary-500/80 shadow-2xl space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6">
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
                  AHORRA 2 MESES
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Plan Anual Pro</h3>
                  <Badge variant="secondary">Mejor Valor</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$299.99</span>
                  <span className="text-slate-400 text-sm font-medium">/ año</span>
                </div>
                <p className="text-xs text-slate-300">
                  Acceso continuo garantizado por 365 días para especialistas.
                </p>

                <ul className="space-y-3 pt-4 text-sm text-slate-300 border-t border-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Todo lo incluido en el Plan Mensual</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Certificados digitales con código de verificación</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Soporte prioritario y acceso a sesiones exclusivas</span>
                  </li>
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <Button size="lg" variant="secondary" className="w-full font-bold">
                  Comenzar Plan Anual
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">Intranet Médica</span>
              <p className="text-[11px] text-slate-500">
                Plataforma de Educación Médica Continua
              </p>
            </div>
          </div>

          <p className="text-center text-slate-500">
            © {new Date().getFullYear()} Intranet Médica. Cumplimiento con estándares de acreditación clínica.
          </p>

          <div className="flex items-center space-x-4 font-medium">
            <Link to="/login" className="hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              Registro Médico
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
