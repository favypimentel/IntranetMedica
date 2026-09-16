import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Clock,
  Award,
  Sparkles,
  BookOpen,
  Newspaper,
  CreditCard,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { coursesService, EnrollmentItem, Course } from '../services/coursesService';
import { newsService, NewsArticle } from '../services/newsService';
import { membershipService, MembershipInfo } from '../services/membershipService';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [membership, setMembership] = useState<MembershipInfo | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [enrollmentsRes, coursesRes, newsRes, membershipRes] = await Promise.all([
          coursesService.getMyEnrollments(),
          coursesService.getCourses({ limit: 4 }),
          newsService.getNews({ limit: 3 }),
          membershipService.getMyMembership()
        ]);

        setEnrollments(enrollmentsRes.data.enrollments || []);
        setCourses(coursesRes.data.courses || []);
        setNews(newsRes.data.news || []);
        setMembership(membershipRes.data);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
      }
    };

    loadDashboardData();
  }, []);

  const completedCount = enrollments.filter((e) => e.status === 'completed' || e.progress >= 100).length;
  const inProgressEnrollments = enrollments.filter((e) => e.status === 'enrolled' && e.progress < 100);
  const totalHours = enrollments.reduce((sum, e) => sum + (e.course?.durationHours || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 text-white p-6 sm:p-8 shadow-xl shadow-primary-900/10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Médico Verificado • {user?.doctor?.licenseNumber || 'Col. 28391'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Bienvenido, Dr. {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-primary-100 text-xs sm:text-sm leading-relaxed">
              Especialidad en <strong className="text-white">{user?.doctor?.specialty || 'Cardiología Clínica'}</strong> •{' '}
              {user?.doctor?.institution || 'Hospital General'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/courses">
              <Button
                variant="secondary"
                size="md"
                className="font-bold shadow-lg shadow-secondary-900/20"
                rightIcon={<BookOpen className="h-4 w-4" />}
              >
                Explorar Cursos
              </Button>
            </Link>
            <Link to="/membership">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold backdrop-blur-sm"
              >
                Mi Membresía
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative circle background */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Cursos en Progreso */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              En Progreso
            </span>
            <div className="h-9 w-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-gray-900">{inProgressEnrollments.length}</span>
            <p className="text-[11px] text-gray-500 mt-0.5">Cursos activos en estudio</p>
          </div>
        </div>

        {/* Cursos Completados */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Completados
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-gray-900">{completedCount}</span>
            <p className="text-[11px] text-gray-500 mt-0.5">Certificaciones alcanzadas</p>
          </div>
        </div>

        {/* Horas Acreditadas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Horas Lectivas
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-gray-900">{totalHours} hrs</span>
            <p className="text-[11px] text-gray-500 mt-0.5">Formación acumulada</p>
          </div>
        </div>

        {/* Estado de Membresía */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Membresía
            </span>
            <div className="h-9 w-9 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">
                {membership?.daysRemaining || 19} d
              </span>
              <Badge variant="success" size="sm">
                {membership?.planType === 'monthly' ? 'Mensual' : 'Anual'}
              </Badge>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">Días restantes de acceso PRO</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Mis Cursos Actuales & Noticias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Mis Cursos en Progreso */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                <PlayCircle className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Continuar Aprendizaje</h2>
            </div>
            <Link to="/my-courses" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              <span>Ver todos mis cursos</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {inProgressEnrollments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-gray-200 text-center space-y-3">
              <GraduationCap className="h-10 w-10 text-gray-400 mx-auto" />
              <p className="font-semibold text-gray-700 text-sm">No tienes cursos en progreso actualmente</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Inscríbete a cualquiera de nuestros programas de actualización clínica para comenzar.
              </p>
              <Link to="/courses">
                <Button size="sm" variant="primary" className="mt-2">
                  Explorar Catálogo de Cursos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {inProgressEnrollments.slice(0, 3).map((item) => (
                <div
                  key={item.enrollmentId}
                  className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:border-primary-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    <img
                      src={item.course.thumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80'}
                      alt={item.course.title}
                      className="h-16 w-16 rounded-xl object-cover shrink-0 border border-gray-100"
                    />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="specialty" size="sm">
                          {item.course.category}
                        </Badge>
                        <span className="text-[11px] text-gray-400">
                          {item.course.durationHours} hrs
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 truncate">
                        {item.course.title}
                      </h3>
                      <div className="max-w-xs">
                        <ProgressBar progress={item.progress} size="sm" />
                      </div>
                    </div>
                  </div>

                  <Link to={`/courses/${item.course.id}`} className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full sm:w-auto font-semibold"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      Continuar
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Recommended Courses Carousel / Grid */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-secondary-100 text-secondary-700 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Cursos Recomendados para tu Especialidad</h2>
              </div>
              <Link to="/courses" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                <span>Ver catálogo</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.slice(0, 2).map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="h-32 rounded-xl overflow-hidden relative">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="specialty" size="sm">
                          {course.category}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[11px] text-gray-500">
                      <strong>{course.durationHours}</strong> hrs
                    </span>
                    <Link to={`/courses/${course.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Noticias Médicas Recientes & Alertas */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Newspaper className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Noticias Médicas</h2>
            </div>
            <Link to="/news" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              <span>Todas</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs divide-y divide-gray-100">
            {news.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="py-3.5 first:pt-1 last:pb-1 block group transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="primary" size="sm" className="text-[10px]">
                    {item.category}
                  </Badge>
                  <span className="text-[10px] text-gray-400">
                    {new Date(item.publishedAt).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-gray-900 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{item.excerpt}</p>
              </Link>
            ))}
          </div>

          {/* Quick Support / Feedback Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-primary-950 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-400">
              <Sparkles className="h-4 w-4" />
              <span>Soporte Médico Continuo</span>
            </div>
            <h3 className="font-bold text-sm text-white leading-snug">
              ¿Requieres un curso específico para tu servicio hospitalario?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Solicita programas a la medida o certificaciones especiales directamente con nuestro comité académico.
            </p>
            <a
              href="mailto:academico@intranet-medica.com"
              className="inline-block text-xs font-bold text-primary-300 hover:text-white underline pt-1"
            >
              Contactar Comité Académico →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
