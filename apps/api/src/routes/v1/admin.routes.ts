import { Router } from 'express';
import { CarController } from '../../controllers/car.controller';
import { BrandController } from '../../controllers/brand.controller';
import { AdminController } from '../../controllers/admin.controller';
import { authenticateJwt, requireRole } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { uploadImageMiddleware } from '../../middleware/upload.middleware';
import { carCreateSchema, carUpdateSchema, brandCreateSchema, brandUpdateSchema } from '@fh6-cars/shared';

const router = Router();
const carController = new CarController();
const brandController = new BrandController();
const adminController = new AdminController();

// Apply auth & rate limiter middleware to all admin routes
router.use(authenticateJwt);

// Admin Cars CRUD & Upload
router.get('/cars', carController.getCars);
router.get('/cars/:id', carController.getCarById);
router.post('/cars/upload', requireRole(['ADMIN', 'EDITOR']), uploadImageMiddleware.single('image'), carController.uploadImage);
router.post('/cars', requireRole(['ADMIN', 'EDITOR']), validateRequest(carCreateSchema, 'body'), carController.createCar);
router.put('/cars/:id', requireRole(['ADMIN', 'EDITOR']), validateRequest(carUpdateSchema, 'body'), carController.updateCar);
router.delete('/cars/:id', requireRole(['ADMIN']), carController.deleteCar);

// Admin Brands CRUD
router.post('/brands', requireRole(['ADMIN', 'EDITOR']), validateRequest(brandCreateSchema, 'body'), brandController.createBrand);
router.put('/brands/:id', requireRole(['ADMIN', 'EDITOR']), validateRequest(brandUpdateSchema, 'body'), brandController.updateBrand);
router.delete('/brands/:id', requireRole(['ADMIN']), brandController.deleteBrand);

// Import & Audit Logs
router.post('/import/cars', requireRole(['ADMIN', 'EDITOR']), adminController.importCars);
router.get('/audit-logs', requireRole(['ADMIN']), adminController.getAuditLogs);

export default router;
