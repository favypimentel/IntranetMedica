import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Award,
  PlayCircle,
  Search,
  ArrowRight
} from 'lucide-react';
import { coursesService, EnrollmentItem } from '../services/coursesService';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const MyCoursesPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        setLoading(true);
        const res = await coursesService.getMyEnrollments();
        setEnrollments(res.data.enrollments || []);
      } catch (err) {
        console.error('Error loading my enrollments', err);
      } finally {
        setLoading(false);
      }
    };
    loadEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter((item) => {
    if (activeFilter === 'in_progress' && (item.progress >= 100 || item.status === 'completed')) {
      return false;
    }
    if (activeFilter === 'completed' && item.progress < 100 && item.status !== 'completed') {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.course?.title.toLowerCase().includes(q) ||
        item.course?.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const completedCount = enrollments.filter((e) => e.progress >= 100 || e.status === 'completed').length;
  const inProgressCount = enrollments.filter((e) => e.progress < 100 && e.status === 'enrolled').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-2">
            Panel del Alumno
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Mis Cursos y Avance Académico
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Realiza seguimiento a tus programas activos y descarga tus certificados acreditados.
          </p>
        </div>

        <Link to="/courses">
          <Button variant="primary" size="md" rightIcon={<BookOpen className="h-4 w-4" />}>
            Explorar Nuevos Cursos
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Inscritos Totales</span>
            <p className="text-2xl font-black text-gray-900">{enrollments.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <PlayCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">En Progreso</span>
            <p className="text-2xl font-black text-gray-900">{inProgressCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Completados</span>
            <p className="text-2xl font-black text-gray-900">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({enrollments.length})
          </button>
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFilter === 'in_progress'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En Progreso ({inProgressCount})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFilter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completados ({completedCount})
          </button>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por nombre..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Course Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-gray-200 animate-pulse" />
          ))}
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="font-bold text-gray-800 text-base">No hay cursos en esta sección</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explora nuestro catálogo para inscribirte en programas de actualización médica.
          </p>
          <Link to="/courses">
            <Button size="sm" variant="primary">
              Ir al Catálogo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEnrollments.map((item) => {
            const isFinished = item.progress >= 100 || item.status === 'completed';

            return (
              <div
                key={item.enrollmentId}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.course?.thumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80'}
                    alt={item.course?.title}
                    className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-gray-100"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="specialty" size="sm">
                        {item.course?.category}
                      </Badge>
                      {isFinished ? (
                        <Badge variant="success" size="sm">
                          Completado
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-gray-400">
                          {item.course?.durationHours} hrs
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2">
                      {item.course?.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <ProgressBar progress={item.progress} label="Avance del Curso" size="sm" />

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-gray-400">
                      Inscrito: {new Date(item.enrollmentDate).toLocaleDateString('es-ES')}
                    </span>
                    <Link to={`/courses/${item.courseId || item.course?.id}`}>
                      <Button
                        size="sm"
                        variant={isFinished ? 'outline' : 'primary'}
                        className="font-semibold text-xs"
                        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      >
                        {isFinished ? 'Revisar Módulos' : 'Continuar'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
