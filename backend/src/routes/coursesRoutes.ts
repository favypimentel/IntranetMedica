import { Router } from 'express';
import { body, param } from 'express-validator';
import * as coursesController from '../controllers/coursesController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener lista de cursos
router.get('/', coursesController.getCourses);

// Obtener detalles de un curso
router.get(
  '/:courseId',
  param('courseId').isInt().withMessage('Course ID must be an integer'),
  validateRequest,
  coursesController.getCourseById
);

// Inscribirse en un curso
router.post(
  '/:courseId/enroll',
  param('courseId').isInt().withMessage('Course ID must be an integer'),
  validateRequest,
  coursesController.enrollInCourse
);

// Obtener cursos inscritos
router.get('/me/enrollments', coursesController.getMyEnrollments);

// Actualizar progreso de un curso
router.put(
  '/enrollments/:enrollmentId/progress',
  [
    param('enrollmentId').isInt().withMessage('Enrollment ID must be an integer'),
    body('progress').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
    validateRequest
  ],
  coursesController.updateProgress
);

export default router;
