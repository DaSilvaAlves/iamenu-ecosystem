import { Request, Response } from 'express';
import logger from '../lib/logger';
import { notificationsService } from '../services/notifications.service';

/**
 * Notifications Controller
 * Handles HTTP requests for notifications
 */
export class NotificationsController {
  /**
   * GET /api/v1/community/notifications
   * Get all notifications for current user
   */
  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await notificationsService.getUserNotifications(userId, limit, offset);

      res.status(200).json({
        success: true,
        data: result.notifications,
        unreadCount: result.unreadCount,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total,
        },
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching notifications failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications',
      });
    }
  }

  /**
   * PATCH /api/v1/community/notifications/:id/read
   * Mark notification as read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const notification = await notificationsService.markAsRead(id, userId);

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found or you are not the owner',
        });
      }

      res.status(200).json({
        success: true,
        data: notification,
        message: 'Notification marked as read',
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error marking notification as read failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read',
      });
    }
  }

  /**
   * PATCH /api/v1/community/notifications/read-all
   * Mark all notifications as read
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const count = await notificationsService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        data: { count },
        message: `${count} notifications marked as read`,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error marking all notifications as read failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read',
      });
    }
  }

  /**
   * DELETE /api/v1/community/notifications/:id
   * Delete notification
   */
  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const deleted = await notificationsService.deleteNotification(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found or you are not the owner',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error deleting notification failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to delete notification',
      });
    }
  }
}

export const notificationsController = new NotificationsController();
