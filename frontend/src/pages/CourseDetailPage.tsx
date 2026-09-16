import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  ShieldCheck,
  Star,
  Download,
  Check
} from 'lucide-react';
import { coursesService, Course, EnrollmentItem } from '../services/coursesService';
import { useToastStore } from '../stores/toastStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentItem | null>(null);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'description' | 'resources'>('syllabus');
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const fetchCourseData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const courseRes = await coursesService.getCourseById(Number(id));
      setCourse(courseRes.data);

      const enrollmentsRes = await coursesService.getMyEnrollments();
      const current = enrollmentsRes.data.enrollments.find(
        (e) => e.courseId === Number(id) || e.course?.id === Number(id)
      );
      setEnrollment(current || null);

      if (courseRes.data.syllabus?.length) {
        setSelectedModuleId(courseRes.data.syllabus[0].id);
      }
    } catch (err) {
      console.error('Error fetching course detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    if (!course) return;
    try {
      setEnrolling(true);
      await coursesService.enrollInCourse(course.id);
      addToast({
        type: 'success',
        title: '¡Inscripción Confirmada!',
        message: `Ya puedes acceder a los módulos de "${course.title}".`
      });
      await fetchCourseData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error al inscribirse',
        message: err.message || 'No fue posible completar la inscripción.'
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleModuleComplete = async (moduleId: number) => {
    if (!enrollment || !course) return;

    const completed = enrollment.completedModules || [];
    const isCompleted = completed.includes(moduleId);

    let updatedCompleted: number[];
    if (isCompleted) {
      updatedCompleted = completed.filter((m) => m !== moduleId);
    } else {
      updatedCompleted = [...completed, moduleId];
    }

    const totalModules = course.syllabus?.length || 1;
    const newProgress = Math.round((updatedCompleted.length / totalModules) * 100);

    try {
      await coursesService.updateProgress(enrollment.enrollmentId, newProgress, moduleId);

      setEnrollment({
        ...enrollment,
        progress: newProgress,
        completedModules: updatedCompleted,
        status: newProgress >= 100 ? 'completed' : 'enrolled'
      });

      if (newProgress >= 100 && !isCompleted) {
        addToast({
          type: 'success',
          title: '¡Curso Completado al 100%!',
          message: 'Has finalizado todos los módulos clínicos. Certificado disponible.'
        });
      }
    } catch (err) {
      console.error('Error updating module progress', err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Cargando información del curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Curso no encontrado</h2>
        <Link to="/courses">
          <Button variant="primary">Volver al Catálogo</Button>
        </Link>
      </div>
    );
  }

  const selectedModule = course.syllabus?.find((m) => m.id === selectedModuleId) || course.syllabus?.[0];
  const isModuleCompleted = (mId: number) => (enrollment?.completedModules || []).includes(mId);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Catálogo de Cursos</span>
        </button>
      </div>

      {/* Course Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 sm:p-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="specialty">{course.category}</Badge>
              <Badge variant="neutral" className="bg-slate-800 text-slate-300 border-slate-700">
                {course.level || 'Avanzado'}
              </Badge>
              <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold ml-1">
                <Star className="h-4 w-4 fill-current" />
                {course.rating || 4.9}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {course.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block text-[11px]">Instructor Principal:</span>
                <strong className="text-white text-sm">{course.instructor}</strong>
                <span className="text-slate-400 block text-[11px]">{course.instructorTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Duración Acreditada:</span>
                <strong className="text-white text-sm">{course.durationHours} horas lectivas</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Médicos Inscritos:</span>
                <strong className="text-white text-sm">{course.enrolledCount || 150} profesionales</strong>
              </div>
            </div>
          </div>

          {/* Action Card / Enrollment Widget */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-36 rounded-xl overflow-hidden relative">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {enrollment ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Inscrito en este curso
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {enrollment.progress >= 100 ? 'Completado' : 'En estudio'}
                    </span>
                  </div>
                  <ProgressBar progress={enrollment.progress} size="md" />
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-emerald-400 text-xs font-bold">
                    Incluido con tu Membresía Médica
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Acceso completo a todos los módulos y evaluación final.
                  </p>
                </div>
              )}
            </div>

            <div>
              {enrollment ? (
                enrollment.progress >= 100 ? (
                  <Button
                    variant="success"
                    size="md"
                    className="w-full font-bold"
                    leftIcon={<Award className="h-4 w-4" />}
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: 'Certificado Digital',
                        message: `Descargando certificado acreditado de: "${course.title}"...`
                      });
                    }}
                  >
                    Descargar Certificado
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full font-bold"
                    rightIcon={<PlayCircle className="h-4 w-4" />}
                    onClick={() => setActiveTab('syllabus')}
                  >
                    Continuar Estudiando
                  </Button>
                )
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-lg shadow-primary-600/30"
                  isLoading={enrolling}
                  onClick={handleEnroll}
                >
                  Inscribirse Ahora
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {enrollment && enrollment.progress >= 100 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg">¡Felicitaciones! Has completado el programa clínico</h3>
              <p className="text-xs text-emerald-100">
                Has cumplido satisfactoriamente las {course.durationHours} horas de formación médica continua.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="md"
            className="bg-white text-emerald-900 hover:bg-emerald-50 border-0 font-bold shadow-sm"
            leftIcon={<Download className="h-4 w-4 text-emerald-700" />}
            onClick={() => {
              addToast({
                type: 'success',
                title: 'Certificado Generado',
                message: `Certificado Nº MED-${course.id}849 expedido con éxito.`
              });
            }}
          >
            Descargar Diploma Acreditado
          </Button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-4 border-b border-gray-200 text-sm font-bold">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'syllabus'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Módulos y Temario ({course.syllabus?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('description')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'description'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Objetivos Clínicos</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'resources'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Instructor y Aval Académico</span>
        </button>
      </div>

      {/* Tab Content: Syllabus / Modules */}
      {activeTab === 'syllabus' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Modules List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Estructura del Curso
            </h3>

            <div className="space-y-2">
              {course.syllabus?.map((mod) => {
                const isCompleted = isModuleCompleted(mod.id);
                const isSelected = selectedModule?.id === mod.id;

                return (
                  <div
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-primary-50/80 border-primary-300 shadow-xs'
                        : 'bg-white border-gray-200/80 hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary-700 bg-primary-100/60 px-2 py-0.5 rounded-md">
                          Módulo {mod.moduleNumber}
                        </span>
                        <span className="text-[11px] text-gray-400">{mod.duration}</span>
                      </div>
                      <h4 className="font-bold text-xs text-gray-900 leading-snug">
                        {mod.title}
                      </h4>
                    </div>

                    {enrollment && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleModuleComplete(mod.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                          isCompleted
                            ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'
                        }`}
                        title={isCompleted ? 'Módulo completado' : 'Marcar como completado'}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module Detail Viewer / Lesson Simulator */}
          <div className="lg:col-span-2">
            {selectedModule ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                      Módulo {selectedModule.moduleNumber} • {selectedModule.duration}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">
                      {selectedModule.title}
                    </h3>
                  </div>

                  {enrollment && (
                    <Button
                      size="sm"
                      variant={isModuleCompleted(selectedModule.id) ? 'success' : 'outline'}
                      leftIcon={<Check className="h-4 w-4" />}
                      onClick={() => handleToggleModuleComplete(selectedModule.id)}
                    >
                      {isModuleCompleted(selectedModule.id)
                        ? 'Módulo Completado'
                        : 'Marcar como Completado'}
                    </Button>
                  )}
                </div>

                {/* Simulated Lesson Video / Presentation Window */}
                <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center text-center p-6 text-white shadow-inner">
                  <div className="h-16 w-16 rounded-full bg-primary-600/90 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg">
                    <PlayCircle className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-sm text-white mt-4 max-w-md">
                    Reproducción de Sesión Clínica y Discusión de Guías
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Duración: {selectedModule.duration} • Calidad 1080p HD
                  </p>
                </div>

                {/* Module Summary & Content */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-gray-900">Resumen y Puntos Clave:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedModule.summary}
                  </p>
                </div>

                {/* Recommended Reading Resource */}
                <div className="p-4 rounded-2xl bg-primary-50/50 border border-primary-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Guía Clínica de Soporte (PDF)</p>
                      <p className="text-[11px] text-gray-500">Documento complementario de estudio</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary-700 hover:bg-primary-100"
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: 'Descarga Iniciada',
                        message: 'Descargando material bibliográfico del módulo...'
                      });
                    }}
                  >
                    Descargar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-gray-200">
                <p className="text-sm text-gray-500">Selecciona un módulo para visualizar el contenido.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Description */}
      {activeTab === 'description' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Objetivos Pedagógicos y Competencias</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Este programa ha sido diseñado con un enfoque eminentemente clínico y traslacional,
              permitiendo al médico especialista y general:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 pl-4 list-disc">
              <li>Identificar precozmente los criterios diagnósticos actualizados según la evidencia 2026.</li>
              <li>Ajustar regímenes terapéuticos farmacológicos basados en metas hemodinámicas y metabólicas.</li>
              <li>Prevenir complicaciones hospitalarias y optimizar los tiempos de respuesta en urgencias.</li>
              <li>Interpretar estudios diagnósticos avanzados y biomarcadores cuantitativos.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab Content: Resources / Aval */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl shrink-0">
              {course.instructor.charAt(4) || 'D'}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">{course.instructor}</h3>
              <p className="text-xs text-primary-600 font-semibold">{course.instructorTitle}</p>
              <p className="text-xs text-gray-500 leading-relaxed pt-1">
                Especialista con más de 15 años de trayectoria clínica hospitalaria e investigación
                publicada en revistas de impacto internacional.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
