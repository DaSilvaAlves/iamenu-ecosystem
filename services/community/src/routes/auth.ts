import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

/**
 * Auth Routes
 * Base path: /api/v1/community/auth
 */

// Development only: Generate test JWT token with refresh token
// ⚠️ REMOVER EM PRODUÇÃO!
router.get('/test-token', authController.generateTestToken.bind(authController));

// Refresh access token using refresh token
// POST /api/v1/community/auth/refresh
// Body: { "refreshToken": "<refresh-token>" }
router.post('/refresh', authController.refresh.bind(authController));

// Logout - revoke refresh token
// POST /api/v1/community/auth/logout
// Body: { "refreshToken": "<refresh-token>" }
router.post('/logout', authController.logout.bind(authController));

// Logout from all devices - requires authentication
// POST /api/v1/community/auth/logout-all
router.post('/logout-all', authenticateJWT, authController.logoutAll.bind(authController));

// Get active sessions - requires authentication
// GET /api/v1/community/auth/sessions
router.get('/sessions', authenticateJWT, authController.getSessions.bind(authController));

export default router;
