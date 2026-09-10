import { Router } from 'express';
import { LookupController } from '../../controllers/lookup.controller';
import { BrandController } from '../../controllers/brand.controller';

const router = Router();
const lookupController = new LookupController();
const brandController = new BrandController();

router.get('/brands', brandController.getBrands);
router.get('/brands/:slug', brandController.getBrandBySlug);
router.get('/classes', lookupController.getClasses);
router.get('/drivetrains', lookupController.getDrivetrains);
router.get('/car-types', lookupController.getCarTypes);
router.get('/countries', lookupController.getCountries);
router.get('/statistics', lookupController.getStatistics);

export default router;
