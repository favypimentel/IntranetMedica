import { Router } from 'express';
import { param } from 'express-validator';
import * as newsController from '../controllers/newsController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener lista de noticias
router.get('/', newsController.getNews);

// Obtener detalles de una noticia
router.get(
  '/:newsId',
  param('newsId').isInt().withMessage('News ID must be an integer'),
  validateRequest,
  newsController.getNewsById
);

export default router;
