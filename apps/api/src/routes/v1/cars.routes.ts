import { Router } from 'express';
import { CarController } from '../../controllers/car.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { carQuerySchema } from '@fh6-cars/shared';

const router = Router();
const carController = new CarController();

router.get('/search', carController.searchCars);
router.get('/ordinal/:ordinal', carController.getCarByOrdinal);
router.get('/:id', carController.getCarById);
router.get('/', validateRequest(carQuerySchema, 'query'), carController.getCars);

export default router;
