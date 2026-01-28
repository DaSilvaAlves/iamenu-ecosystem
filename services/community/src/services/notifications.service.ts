import prisma from '../lib/prisma';
import { websocketService } from './websocket.service';

export interface CreateNotificationDto {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}

/**
 * Notifications Service
 * Handles all database operations for notifications
 * Now with real-time WebSocket delivery
 */
export class NotificationsService {
  /**
   * Create a new notification and send via WebSocket
   */
  async createNotification(data: CreateNotificationDto) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        body: data.body,
        link: data.link,
      },
    });

    // Send real-time notification via WebSocket
    websocketService.sendNotification(data.userId, {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body || undefined,
      link: notification.link || undefined,
      createdAt: notification.createdAt
    });

    return notification;
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: string, limit = 20, offset = 0) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.notification.count({ where: { userId } });
    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    return {
      notifications,
      total,
      unreadCount,
      limit,
      offset,
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string, userId: string) {
    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return null;
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return updated;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    return result.count;
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string, userId: string) {
    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return false;
    }

    await prisma.notification.delete({
      where: { id },
    });

    return true;
  }
}

export const notificationsService = new NotificationsService();
