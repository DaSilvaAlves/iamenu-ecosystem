import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

/**
 * Auth Routes
 * Base path: /api/v1/community/auth
 */

// Development only: Generate test JWT token
// ⚠️ REMOVER EM PRODUÇÃO!
router.get('/test-token', authController.generateTestToken.bind(authController));

export default router;
