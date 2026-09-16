import { Router } from 'express';
import * as paymentsController from '../controllers/paymentsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener historial de pagos
router.get('/me', paymentsController.getMyPayments);

// Obtener pagos pendientes
router.get('/me/pending', paymentsController.getPendingPayments);

export default router;
