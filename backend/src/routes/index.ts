import { Router } from 'express';
import authRoutes from './authRoutes';
import coursesRoutes from './coursesRoutes';
import newsRoutes from './newsRoutes';
import membershipRoutes from './membershipRoutes';
import paymentsRoutes from './paymentsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use('/news', newsRoutes);
router.use('/memberships', membershipRoutes);
router.use('/payments', paymentsRoutes);

export default router;
