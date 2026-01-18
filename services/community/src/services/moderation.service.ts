import { PrismaClient } from '../../prisma/generated/client';
import { notificationsService } from './notifications.service';

const prisma = new PrismaClient();

export interface CreateReportDto {
  reporterId: string;
  targetType: 'post' | 'comment';
  targetId: string;
  reason: 'spam' | 'offensive' | 'harassment' | 'inappropriate' | 'other';
  details?: string;
}

export interface ReviewReportDto {
  reportId: string;
  action: 'approve' | 'reject';
  adminId: string;
  notes?: string;
}

export class ModerationService {
  /**
   * Create a new report
   */
  async createReport(data: CreateReportDto) {
    // Check if target exists
    if (data.targetType === 'post') {
      const post = await prisma.post.findUnique({
        where: { id: data.targetId }
      });
      if (!post) {
        throw new Error('Post not found');
      }
    } else if (data.targetType === 'comment') {
      const comment = await prisma.comment.findUnique({
        where: { id: data.targetId }
      });
      if (!comment) {
        throw new Error('Comment not found');
      }
    }

    // Check if user already reported this content
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: data.reporterId,
        targetType: data.targetType,
        targetId: data.targetId,
        status: { in: ['pending', 'reviewed'] }
      }
    });

    if (existingReport) {
      throw new Error('You already reported this content');
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        reporterId: data.reporterId,
        targetType: data.targetType,
        targetId: data.targetId,
        reason: data.reason,
        details: data.details,
        status: 'pending'
      }
    });

    return report;
  }

  /**
   * Get all reports (admin only)
   */
  async getReports(
    status?: 'pending' | 'reviewed' | 'resolved' | 'rejected',
    limit = 20,
    offset = 0
  ) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.report.count({ where })
    ]);

    return {
      reports,
      total,
      limit,
      offset
    };
  }

  /**
   * Get single report by ID
   */
  async getReportById(reportId: string) {
    const report = await prisma.report.findUnique({
      where: { id: reportId }
    });

    if (!report) {
      throw new Error('Report not found');
    }

    // Get target content details
    let targetContent = null;
    if (report.targetType === 'post') {
      targetContent = await prisma.post.findUnique({
        where: { id: report.targetId }
      });
    } else if (report.targetType === 'comment') {
      targetContent = await prisma.comment.findUnique({
        where: { id: report.targetId }
      });
    }

    return {
      ...report,
      targetContent
    };
  }

  /**
   * Review a report (admin action)
   */
  async reviewReport(data: ReviewReportDto) {
    const report = await prisma.report.findUnique({
      where: { id: data.reportId }
    });

    if (!report) {
      throw new Error('Report not found');
    }

    if (report.status !== 'pending') {
      throw new Error('Report already reviewed');
    }

    // Update report status
    const updatedReport = await prisma.report.update({
      where: { id: data.reportId },
      data: {
        status: data.action === 'approve' ? 'resolved' : 'rejected',
        reviewedBy: data.adminId,
        reviewedAt: new Date(),
        notes: data.notes
      }
    });

    // If approved, remove the content
    if (data.action === 'approve') {
      await this.removeContent(
        report.targetType as 'post' | 'comment',
        report.targetId,
        data.adminId,
        `Report approved: ${report.reason}`
      );
    }

    return updatedReport;
  }

  /**
   * Remove content (soft delete)
   */
  async removeContent(
    targetType: 'post' | 'comment',
    targetId: string,
    adminId: string,
    reason: string
  ) {
    if (targetType === 'post') {
      const post = await prisma.post.findUnique({
        where: { id: targetId }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      if (post.status === 'removed') {
        throw new Error('Post already removed');
      }

      // Soft delete post
      await prisma.post.update({
        where: { id: targetId },
        data: { status: 'removed' }
      });

      // Notify post author
      await notificationsService.createNotification({
        userId: post.authorId,
        type: 'moderation',
        title: 'O teu post foi removido',
        body: `Motivo: ${reason}`,
        link: `/posts/${targetId}`
      });
    } else if (targetType === 'comment') {
      const comment = await prisma.comment.findUnique({
        where: { id: targetId }
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.status === 'removed') {
        throw new Error('Comment already removed');
      }

      // Soft delete comment
      await prisma.comment.update({
        where: { id: targetId },
        data: { status: 'removed' }
      });

      // Notify comment author
      await notificationsService.createNotification({
        userId: comment.authorId,
        type: 'moderation',
        title: 'O teu comentário foi removido',
        body: `Motivo: ${reason}`,
        link: `/posts/${comment.postId}`
      });
    }

    return { success: true, message: 'Content removed successfully' };
  }

  /**
   * Restore removed content (admin only)
   */
  async restoreContent(
    targetType: 'post' | 'comment',
    targetId: string,
    adminId: string
  ) {
    if (targetType === 'post') {
      const post = await prisma.post.findUnique({
        where: { id: targetId }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      if (post.status !== 'removed') {
        throw new Error('Post is not removed');
      }

      await prisma.post.update({
        where: { id: targetId },
        data: { status: 'active' }
      });

      // Notify post author
      await notificationsService.createNotification({
        userId: post.authorId,
        type: 'moderation',
        title: 'O teu post foi restaurado',
        body: 'Um admin restaurou o teu post',
        link: `/posts/${targetId}`
      });
    } else if (targetType === 'comment') {
      const comment = await prisma.comment.findUnique({
        where: { id: targetId }
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.status !== 'removed') {
        throw new Error('Comment is not removed');
      }

      await prisma.comment.update({
        where: { id: targetId },
        data: { status: 'active' }
      });

      // Notify comment author
      await notificationsService.createNotification({
        userId: comment.authorId,
        type: 'moderation',
        title: 'O teu comentário foi restaurado',
        body: 'Um admin restaurou o teu comentário',
        link: `/posts/${comment.postId}`
      });
    }

    return { success: true, message: 'Content restored successfully' };
  }
}

export const moderationService = new ModerationService();
