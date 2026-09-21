import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { authenticateJwt } from '../../middleware/auth.middleware';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@fh6-cars/shared';

const router = Router();
const authController = new AuthController();

router.post('/login', validateRequest(loginSchema, 'body'), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticateJwt, authController.me);
router.post('/forgot-password', validateRequest(forgotPasswordSchema, 'body'), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema, 'body'), authController.resetPassword);

export default router;
