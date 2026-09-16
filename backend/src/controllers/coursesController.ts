import { Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Course, Enrollment, User, Membership, MembershipStatus } from '../models';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Obtener lista de cursos con paginación y filtros
export const getCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(
      parseInt(req.query.limit as string) || 20,
      parseInt(process.env.MAX_PAGE_SIZE || '100')
    );
    const offset = (page - 1) * limit;
    const category = req.query.category as string;
    const search = req.query.search as string;

    // Construir condiciones de búsqueda
    const where: any = { is_active: true };

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Obtener cursos con paginación
    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        courses: courses.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          category: course.category,
          durationHours: course.duration_hours,
          instructor: course.instructor,
          thumbnailUrl: course.thumbnail_url,
          isActive: course.is_active,
          createdAt: course.created_at
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener detalles de un curso específico
export const getCourseById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId);

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Contar inscripciones
    const enrolledCount = await Enrollment.count({
      where: { course_id: course.id }
    });

    res.status(200).json({
      success: true,
      data: {
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        durationHours: course.duration_hours,
        instructor: course.instructor,
        thumbnailUrl: course.thumbnail_url,
        isActive: course.is_active,
        enrolledCount,
        createdAt: course.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// Inscribirse en un curso
export const enrollInCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.id;

    // Verificar que el curso existe
    const course = await Course.findByPk(courseId);
    if (!course || !course.is_active) {
      throw new AppError('Course not found or inactive', 404);
    }

    // Verificar que el usuario tiene membresía activa
    const membership = await Membership.findOne({
      where: { user_id: userId }
    });

    if (!membership || !membership.isActive()) {
      throw new AppError('Active membership required to enroll in courses', 403);
    }

    // Verificar que no está inscrito previamente
    const existingEnrollment = await Enrollment.findOne({
      where: {
        user_id: userId,
        course_id: courseId
      }
    });

    if (existingEnrollment) {
      throw new AppError('Already enrolled in this course', 409);
    }

    // Crear inscripción
    const enrollment = await Enrollment.create({
      user_id: userId,
      course_id: parseInt(courseId)
    });

    res.status(201).json({
      success: true,
      data: {
        enrollmentId: enrollment.id,
        courseId: enrollment.course_id,
        userId: enrollment.user_id,
        status: enrollment.status,
        enrollmentDate: enrollment.enrollment_date
      },
      message: 'Inscripción exitosa al curso'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener cursos inscritos del usuario
export const getMyEnrollments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const status = req.query.status as string;

    // Construir condiciones
    const where: any = { user_id: userId };
    if (status) {
      where.status = status;
    }

    // Obtener inscripciones con información del curso
    const enrollments = await Enrollment.findAll({
      where,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'thumbnail_url', 'duration_hours', 'category']
        }
      ],
      order: [['enrollment_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        enrollments: enrollments.map(enrollment => ({
          enrollmentId: enrollment.id,
          course: {
            id: (enrollment as any).course.id,
            title: (enrollment as any).course.title,
            thumbnailUrl: (enrollment as any).course.thumbnail_url,
            durationHours: (enrollment as any).course.duration_hours,
            category: (enrollment as any).course.category
          },
          status: enrollment.status,
          progress: enrollment.progress,
          enrollmentDate: enrollment.enrollment_date,
          completedAt: enrollment.completed_at
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar progreso de un curso
export const updateProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;
    const userId = req.user!.id;

    // Buscar inscripción
    const enrollment = await Enrollment.findOne({
      where: {
        id: enrollmentId,
        user_id: userId
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    // Actualizar progreso
    enrollment.progress = progress;

    // Si llegó al 100%, marcar como completado
    if (progress >= 100) {
      enrollment.status = 'completed' as any;
      enrollment.completed_at = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      data: {
        enrollmentId: enrollment.id,
        progress: enrollment.progress,
        status: enrollment.status,
        completedAt: enrollment.completed_at
      },
      message: 'Progress updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
