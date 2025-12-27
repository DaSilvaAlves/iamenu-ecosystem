import { Router } from 'express';
import { moderationController } from '../controllers/moderation.controller';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';

const router = Router();

/**
 * Moderation Routes
 * Base path: /api/v1/community
 */

// Create report (authenticated users only)
router.post('/reports', authenticateJWT, moderationController.createReport.bind(moderationController));

// Get all reports (admin only)
router.get('/reports', authenticateJWT, authorizeAdmin, moderationController.getReports.bind(moderationController));

// Get single report (admin only)
router.get('/reports/:id', authenticateJWT, authorizeAdmin, moderationController.getReportById.bind(moderationController));

// Review report (admin only)
router.patch('/reports/:id/review', authenticateJWT, authorizeAdmin, moderationController.reviewReport.bind(moderationController));

// Remove content directly (admin only)
router.delete('/moderate/:targetType/:id', authenticateJWT, authorizeAdmin, moderationController.removeContent.bind(moderationController));

// Restore removed content (admin only)
router.post('/moderate/:targetType/:id/restore', authenticateJWT, authorizeAdmin, moderationController.restoreContent.bind(moderationController));

export default router;
