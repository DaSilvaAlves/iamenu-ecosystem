import { Router } from 'express';
import { moderationController } from '../controllers/moderation.controller';
import { authenticateJWT, authorizeAdmin, authorizeModerator } from '../middleware/auth';

const router = Router();

/**
 * Moderation Routes
 * Base path: /api/v1/community
 */

// ============================================
// REPORTS (User-facing)
// ============================================

// Create report (authenticated users only)
router.post('/reports', authenticateJWT, moderationController.createReport.bind(moderationController));

// Get all reports (admin only)
router.get('/reports', authenticateJWT, authorizeAdmin, moderationController.getReports.bind(moderationController));

// Get single report (admin only)
router.get('/reports/:id', authenticateJWT, authorizeAdmin, moderationController.getReportById.bind(moderationController));

// Review report (admin only)
router.patch('/reports/:id/review', authenticateJWT, authorizeAdmin, moderationController.reviewReport.bind(moderationController));

// ============================================
// MODERATION QUEUE (Admin/Moderator)
// ============================================

// Get prioritized moderation queue
router.get('/moderation/queue', authenticateJWT, authorizeModerator, moderationController.getQueue.bind(moderationController));

// Get queue statistics/dashboard
router.get('/moderation/stats', authenticateJWT, authorizeModerator, moderationController.getQueueStats.bind(moderationController));

// Bulk approve reports for a target
router.post('/moderation/bulk-approve', authenticateJWT, authorizeAdmin, moderationController.bulkApprove.bind(moderationController));

// Bulk reject reports for a target
router.post('/moderation/bulk-reject', authenticateJWT, authorizeAdmin, moderationController.bulkReject.bind(moderationController));

// ============================================
// CONTENT MODERATION (Admin)
// ============================================

// Remove content directly (admin only)
router.delete('/moderate/:targetType/:id', authenticateJWT, authorizeAdmin, moderationController.removeContent.bind(moderationController));

// Restore removed content (admin only)
router.post('/moderate/:targetType/:id/restore', authenticateJWT, authorizeAdmin, moderationController.restoreContent.bind(moderationController));

// ============================================
// USER MODERATION (Admin)
// ============================================

// Issue warning to user
router.post('/moderation/users/:userId/warn', authenticateJWT, authorizeAdmin, moderationController.warnUser.bind(moderationController));

// Ban user
router.post('/moderation/users/:userId/ban', authenticateJWT, authorizeAdmin, moderationController.banUser.bind(moderationController));

// Unban user
router.delete('/moderation/users/:userId/ban', authenticateJWT, authorizeAdmin, moderationController.unbanUser.bind(moderationController));

// Get user moderation history
router.get('/moderation/users/:userId/history', authenticateJWT, authorizeModerator, moderationController.getUserHistory.bind(moderationController));

// ============================================
// AUDIT LOG (Admin)
// ============================================

// Get moderation action logs
router.get('/moderation/logs', authenticateJWT, authorizeAdmin, moderationController.getLogs.bind(moderationController));

export default router;
