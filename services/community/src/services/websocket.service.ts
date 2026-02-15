import { Server as SocketServer, Socket } from 'socket.io';
import type { Server as HttpServer } from 'http';
import * as jwt from 'jsonwebtoken';
import logger from '../lib/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
}

interface OnlineUser {
  socketId: string;
  email?: string;
  connectedAt: Date;
}

/**
 * WebSocket Service
 * Handles real-time communication via Socket.io
 */
export class WebSocketService {
  private io: SocketServer | null = null;
  private onlineUsers: Map<string, OnlineUser> = new Map();

  /**
   * Initialize Socket.io server
   */
  initialize(httpServer: HttpServer): void {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: [
          'http://localhost:5173',
          'http://localhost:3000',
          'https://prototype-vision.vercel.app',
          process.env.CORS_ORIGIN || '*'
        ],
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.query.token;

        if (!token) {
          return next(new Error('Authentication required'));
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          return next(new Error('Server configuration error'));
        }

        const decoded = jwt.verify(token as string, JWT_SECRET) as {
          userId: string;
          email: string;
        };

        socket.userId = decoded.userId;
        socket.email = decoded.email;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      this.handleConnection(socket);
    });

    logger.info('WebSocket server initialized');
  }

  /**
   * Handle new socket connection
   */
  private handleConnection(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;
    const email = socket.email;

    logger.info('WebSocket user connected', { userId, email });

    // Add to online users
    this.onlineUsers.set(userId, {
      socketId: socket.id,
      email,
      connectedAt: new Date()
    });

    // Join user's private room
    socket.join(`user:${userId}`);

    // Notify others that user is online
    socket.broadcast.emit('user:online', { userId });

    // Send current online users to the connected user
    socket.emit('users:online', Array.from(this.onlineUsers.keys()));

    // Handle events
    this.setupEventHandlers(socket);

    // Handle disconnect
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  /**
   * Setup event handlers for a socket
   */
  private setupEventHandlers(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;

    // Join a room (e.g., group chat, post comments)
    socket.on('room:join', (roomId: string) => {
      socket.join(roomId);
      logger.debug('WebSocket user joined room', { userId, roomId });
    });

    // Leave a room
    socket.on('room:leave', (roomId: string) => {
      socket.leave(roomId);
      logger.debug('WebSocket user left room', { userId, roomId });
    });

    // Mark notifications as read (real-time sync across devices)
    socket.on('notifications:read', (notificationIds: string[]) => {
      // Broadcast to other devices of same user
      socket.to(`user:${userId}`).emit('notifications:marked-read', notificationIds);
    });

    // Typing indicator for comments
    socket.on('typing:start', (data: { postId: string }) => {
      socket.to(`post:${data.postId}`).emit('user:typing', {
        userId,
        postId: data.postId
      });
    });

    socket.on('typing:stop', (data: { postId: string }) => {
      socket.to(`post:${data.postId}`).emit('user:stopped-typing', {
        userId,
        postId: data.postId
      });
    });

    // Ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong');
    });
  }

  /**
   * Handle socket disconnect
   */
  private handleDisconnect(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;

    logger.info('WebSocket user disconnected', { userId });

    // Remove from online users
    this.onlineUsers.delete(userId);

    // Notify others that user is offline
    socket.broadcast.emit('user:offline', { userId });
  }

  // ============================================
  // PUBLIC METHODS FOR EMITTING EVENTS
  // ============================================

  /**
   * Send notification to a specific user
   */
  sendNotification(userId: string, notification: {
    id: string;
    type: string;
    title: string;
    body?: string;
    link?: string;
    createdAt: Date;
  }): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('notification:new', notification);
  }

  /**
   * Send notification to multiple users
   */
  sendNotificationToMany(userIds: string[], notification: {
    id: string;
    type: string;
    title: string;
    body?: string;
    link?: string;
    createdAt: Date;
  }): void {
    if (!this.io) return;

    userIds.forEach(userId => {
      this.io!.to(`user:${userId}`).emit('notification:new', notification);
    });
  }

  /**
   * Broadcast to a room (e.g., new comment on a post)
   */
  broadcastToRoom(roomId: string, event: string, data: unknown): void {
    if (!this.io) return;

    this.io.to(roomId).emit(event, data);
  }

  /**
   * Broadcast new post to all connected users
   */
  broadcastNewPost(post: {
    id: string;
    title: string;
    authorId: string;
    category: string;
  }): void {
    if (!this.io) return;

    this.io.emit('post:new', post);
  }

  /**
   * Broadcast new comment to post room
   */
  broadcastNewComment(postId: string, comment: {
    id: string;
    body: string;
    authorId: string;
  }): void {
    if (!this.io) return;

    this.io.to(`post:${postId}`).emit('comment:new', {
      postId,
      ...comment
    });
  }

  /**
   * Notify user of new reaction on their content
   */
  notifyReaction(userId: string, data: {
    type: 'like' | 'useful' | 'thanks';
    targetType: 'post' | 'comment';
    targetId: string;
    reactorId: string;
  }): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('reaction:new', data);
  }

  /**
   * Notify user of new follower
   */
  notifyNewFollower(userId: string, followerId: string): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('follower:new', { followerId });
  }

  /**
   * Broadcast moderation action
   */
  broadcastModerationAction(data: {
    action: 'content_removed' | 'user_banned' | 'user_warned';
    targetType: string;
    targetId: string;
  }): void {
    if (!this.io) return;

    // Broadcast to moderators room
    this.io.to('moderators').emit('moderation:action', data);
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Get count of online users
   */
  getOnlineCount(): number {
    return this.onlineUsers.size;
  }

  /**
   * Get list of online user IDs
   */
  getOnlineUserIds(): string[] {
    return Array.from(this.onlineUsers.keys());
  }

  /**
   * Check if a specific user is online
   */
  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  /**
   * Get Socket.io server instance
   */
  getIO(): SocketServer | null {
    return this.io;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
