import { Router } from 'express';
import carsRouter from './cars.routes';
import lookupsRouter from './lookups.routes';
import authRouter from './auth.routes';
import adminRouter from './admin.routes';

const router = Router();

router.use('/cars', carsRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/', lookupsRouter);

export default router;
