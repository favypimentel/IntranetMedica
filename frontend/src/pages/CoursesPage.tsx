import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Clock,
  Users,
  Star,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { coursesService, Course, EnrollmentItem } from '../services/coursesService';
import { useToastStore } from '../stores/toastStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const CATEGORIES = [
  'Todos',
  'Cardiología',
  'Pediatría',
  'Neurología',
  'Infectología',
  'Cirugía',
  'Endocrinología'
];

export const CoursesPage: React.FC = () => {
  const { addToast } = useToastStore();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  const fetchCoursesAndEnrollments = async () => {
    try {
      setLoading(true);
      const [coursesRes, enrollmentsRes] = await Promise.all([
        coursesService.getCourses({
          category: selectedCategory === 'Todos' ? undefined : selectedCategory,
          search: searchQuery || undefined
        }),
        coursesService.getMyEnrollments()
      ]);

      setCourses(coursesRes.data.courses || []);
      setEnrollments(enrollmentsRes.data.enrollments || []);
    } catch (err) {
      console.error('Error fetching courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndEnrollments();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCoursesAndEnrollments();
  };

  const handleEnroll = async (courseId: number, courseTitle: string) => {
    try {
      setEnrollingId(courseId);
      await coursesService.enrollInCourse(courseId);

      addToast({
        type: 'success',
        title: 'Inscripción Exitosa',
        message: `Te has inscrito correctamente en: "${courseTitle}".`
      });

      await fetchCoursesAndEnrollments();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error de Inscripción',
        message: err.message || 'No fue posible completar la inscripción.'
      });
    } finally {
      setEnrollingId(null);
    }
  };

  const isEnrolled = (courseId: number) => {
    return enrollments.some(
      (e) => e.courseId === courseId || e.course?.id === courseId
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-2">
            Formación Médica Continua
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Catálogo de Cursos de Actualización
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Programas certificados por especialidades con temarios completos y casos clínicos.
          </p>
        </div>

        <Link to="/my-courses">
          <Button variant="outline" size="md" leftIcon={<GraduationCap className="h-4 w-4 text-primary-600" />}>
            Mis Cursos Inscritos ({enrollments.length})
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, temática, instructor o palabras clave..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="font-semibold">
            Buscar Cursos
          </Button>
        </form>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            Especialidad:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 animate-pulse">
              <div className="h-44 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-4">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">No se encontraron cursos</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Intenta cambiar los términos de búsqueda o selecciona otra categoría médica.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const isCurrentEnrolling = enrollingId === course.id;

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-primary-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="h-48 overflow-hidden relative bg-gray-100">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <Badge variant="specialty" size="sm" className="shadow-xs backdrop-blur-md bg-white/90">
                        {course.category}
                      </Badge>
                      <Badge variant="neutral" size="sm" className="bg-slate-900/80 text-white border-0">
                        {course.level || 'Intermedio'}
                      </Badge>
                    </div>

                    {enrolled && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-md">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Inscrito
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-base text-gray-900 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
                      <div>
                        <p className="font-bold text-gray-800">{course.instructor}</p>
                        <p className="text-[10px] text-gray-400">{course.instructorTitle || 'Especialista'}</p>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{course.rating || 4.9}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <strong>{course.durationHours}</strong> hrs
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      {course.enrolledCount || 150}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/courses/${course.id}`}>
                      <Button size="sm" variant="ghost" className="text-xs">
                        Temario
                      </Button>
                    </Link>

                    {enrolled ? (
                      <Link to={`/courses/${course.id}`}>
                        <Button size="sm" variant="success" className="font-semibold text-xs">
                          Continuar
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        isLoading={isCurrentEnrolling}
                        onClick={() => handleEnroll(course.id, course.title)}
                        className="font-semibold text-xs"
                      >
                        Inscribirse
                      </Button>
                    )}
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

export default CoursesPage;
