import { Router } from 'express';
import { notificationsController } from '../controllers/notifications.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

/**
 * Notifications Routes
 * Base path: /api/v1/community/notifications
 * All routes require authentication
 */

// Get user notifications
router.get('/', authenticateJWT, notificationsController.getUserNotifications.bind(notificationsController));

// Mark all as read (must come before /:id routes)
router.patch('/read-all', authenticateJWT, notificationsController.markAllAsRead.bind(notificationsController));

// Mark single notification as read
router.patch('/:id/read', authenticateJWT, notificationsController.markAsRead.bind(notificationsController));

// Delete notification
router.delete('/:id', authenticateJWT, notificationsController.deleteNotification.bind(notificationsController));

export default router;
