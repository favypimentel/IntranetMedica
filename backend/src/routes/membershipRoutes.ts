import { Router } from 'express';
import { body } from 'express-validator';
import * as membershipController from '../controllers/membershipController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener membresía del usuario
router.get('/me', membershipController.getMyMembership);

// Crear o renovar membresía
router.post(
  '/',
  [
    body('planType').isIn(['monthly', 'yearly']).withMessage('Plan type must be monthly or yearly'),
    body('autoRenew').optional().isBoolean().withMessage('Auto renew must be a boolean'),
    validateRequest
  ],
  membershipController.createMembership
);

export default router;
