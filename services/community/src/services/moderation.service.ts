import prisma from '../lib/prisma';
import { notificationsService } from './notifications.service';

export interface CreateReportDto {
  reporterId: string;
  targetType: 'post' | 'comment';
  targetId: string;
  reason: 'spam' | 'offensive' | 'harassment' | 'inappropriate' | 'other';
  details?: string;
}

export interface ReviewReportDto {
  reportId: string;
  action: 'approve' | 'reject' | 'warn' | 'ban';
  adminId: string;
  notes?: string;
  banDuration?: number; // days, 0 = permanent
}

// Severity thresholds for auto-actions
const SEVERITY_CONFIG = {
  WARN_THRESHOLD: 3,      // 3 approved reports = warning
  TEMP_BAN_THRESHOLD: 5,  // 5 = 7-day ban
  PERM_BAN_THRESHOLD: 10, // 10 = permanent ban
};

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

  // ============================================
  // QUEUE MANAGEMENT
  // ============================================

  /**
   * Get moderation queue with prioritization
   * Priority: more reports on same content = higher priority
   */
  async getQueue(limit = 20, offset = 0) {
    // Get pending reports grouped by target
    const reports = await prisma.report.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
    });

    // Group by target and count
    const targetCounts = new Map<string, { count: number; reports: typeof reports }>();

    for (const report of reports) {
      const key = `${report.targetType}:${report.targetId}`;
      const existing = targetCounts.get(key);
      if (existing) {
        existing.count++;
        existing.reports.push(report);
      } else {
        targetCounts.set(key, { count: 1, reports: [report] });
      }
    }

    // Sort by count (priority) descending
    const sorted = Array.from(targetCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(offset, offset + limit);

    // Get content details for each target
    const queue = await Promise.all(
      sorted.map(async ([key, data]) => {
        const [targetType, targetId] = key.split(':');
        let content = null;
        let authorId = null;

        if (targetType === 'post') {
          const post = await prisma.post.findUnique({
            where: { id: targetId },
            select: { id: true, title: true, body: true, authorId: true, createdAt: true }
          });
          content = post;
          authorId = post?.authorId;
        } else if (targetType === 'comment') {
          const comment = await prisma.comment.findUnique({
            where: { id: targetId },
            select: { id: true, body: true, authorId: true, postId: true, createdAt: true }
          });
          content = comment;
          authorId = comment?.authorId;
        }

        // Get author's warning count
        let authorWarnings = 0;
        if (authorId) {
          authorWarnings = await prisma.userWarning.count({
            where: { userId: authorId }
          });
        }

        return {
          targetType,
          targetId,
          reportCount: data.count,
          priority: data.count >= 3 ? 'high' : data.count >= 2 ? 'medium' : 'low',
          reports: data.reports.map(r => ({
            id: r.id,
            reason: r.reason,
            details: r.details,
            createdAt: r.createdAt
          })),
          content,
          authorId,
          authorWarnings,
          oldestReport: data.reports[0].createdAt
        };
      })
    );

    return {
      queue,
      total: targetCounts.size,
      limit,
      offset
    };
  }

  /**
   * Get queue statistics for dashboard
   */
  async getQueueStats() {
    const [
      pendingCount,
      resolvedToday,
      rejectedToday,
      totalWarnings,
      activeBans
    ] = await Promise.all([
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.report.count({
        where: {
          status: 'resolved',
          reviewedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      }),
      prisma.report.count({
        where: {
          status: 'rejected',
          reviewedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      }),
      prisma.userWarning.count(),
      prisma.userBan.count({
        where: {
          OR: [
            { type: 'permanent' },
            { expiresAt: { gt: new Date() } }
          ]
        }
      })
    ]);

    // Reports by reason
    const reportsByReason = await prisma.report.groupBy({
      by: ['reason'],
      where: { status: 'pending' },
      _count: true
    });

    return {
      pending: pendingCount,
      resolvedToday,
      rejectedToday,
      processedToday: resolvedToday + rejectedToday,
      totalWarnings,
      activeBans,
      byReason: reportsByReason.map(r => ({
        reason: r.reason,
        count: r._count
      }))
    };
  }

  // ============================================
  // USER WARNINGS & BANS
  // ============================================

  /**
   * Issue a warning to a user
   */
  async warnUser(
    userId: string,
    moderatorId: string,
    reason: string,
    details?: string,
    reportId?: string
  ) {
    // Create warning
    const warning = await prisma.userWarning.create({
      data: {
        userId,
        issuedBy: moderatorId,
        reason,
        severity: 1,
        details,
        reportId
      }
    });

    // Log action
    await this.logAction(moderatorId, 'user_warned', 'user', userId, reason);

    // Notify user
    await notificationsService.createNotification({
      userId,
      type: 'moderation',
      title: 'Recebeste um aviso',
      body: `Motivo: ${reason}. Comportamento repetido pode resultar em suspensão.`,
    });

    // Check if auto-ban is needed
    const warningCount = await prisma.userWarning.count({ where: { userId } });

    if (warningCount >= SEVERITY_CONFIG.PERM_BAN_THRESHOLD) {
      await this.banUser(userId, moderatorId, 'Múltiplas violações', 0);
    } else if (warningCount >= SEVERITY_CONFIG.TEMP_BAN_THRESHOLD) {
      await this.banUser(userId, moderatorId, 'Múltiplas violações', 7);
    }

    return warning;
  }

  /**
   * Ban a user
   */
  async banUser(
    userId: string,
    moderatorId: string,
    reason: string,
    durationDays: number = 0 // 0 = permanent
  ) {
    const type = durationDays === 0 ? 'permanent' : 'temporary';
    const expiresAt = durationDays > 0
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      : null;

    // Upsert ban
    const ban = await prisma.userBan.upsert({
      where: { userId },
      update: {
        bannedBy: moderatorId,
        reason,
        type,
        expiresAt
      },
      create: {
        userId,
        bannedBy: moderatorId,
        reason,
        type,
        expiresAt
      }
    });

    // Create warning record
    await prisma.userWarning.create({
      data: {
        userId,
        issuedBy: moderatorId,
        reason,
        severity: type === 'permanent' ? 3 : 2,
        expiresAt
      }
    });

    // Log action
    await this.logAction(
      moderatorId,
      type === 'permanent' ? 'user_banned_permanent' : 'user_banned_temp',
      'user',
      userId,
      reason,
      { durationDays }
    );

    // Notify user
    await notificationsService.createNotification({
      userId,
      type: 'moderation',
      title: type === 'permanent' ? 'Conta suspensa permanentemente' : `Conta suspensa por ${durationDays} dias`,
      body: `Motivo: ${reason}`,
    });

    return ban;
  }

  /**
   * Unban a user
   */
  async unbanUser(userId: string, moderatorId: string) {
    await prisma.userBan.delete({
      where: { userId }
    }).catch(() => null); // Ignore if not found

    await this.logAction(moderatorId, 'user_unbanned', 'user', userId);

    await notificationsService.createNotification({
      userId,
      type: 'moderation',
      title: 'A tua conta foi reativada',
      body: 'Podes voltar a participar na comunidade.',
    });

    return { success: true };
  }

  /**
   * Check if user is banned
   */
  async isUserBanned(userId: string): Promise<boolean> {
    const ban = await prisma.userBan.findUnique({
      where: { userId }
    });

    if (!ban) return false;

    // Check if temporary ban expired
    if (ban.type === 'temporary' && ban.expiresAt && ban.expiresAt < new Date()) {
      await prisma.userBan.delete({ where: { userId } });
      return false;
    }

    return true;
  }

  /**
   * Get user's moderation history
   */
  async getUserModerationHistory(userId: string) {
    const [warnings, ban, removedContent] = await Promise.all([
      prisma.userWarning.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.userBan.findUnique({ where: { userId } }),
      prisma.report.count({
        where: {
          status: 'resolved',
          targetId: {
            in: await prisma.post.findMany({
              where: { authorId: userId },
              select: { id: true }
            }).then(posts => posts.map(p => p.id))
          }
        }
      })
    ]);

    return {
      warnings,
      warningCount: warnings.length,
      isBanned: !!ban,
      ban,
      removedContentCount: removedContent
    };
  }

  // ============================================
  // BULK ACTIONS
  // ============================================

  /**
   * Bulk approve reports for same target
   */
  async bulkApproveReports(targetType: string, targetId: string, moderatorId: string, notes?: string) {
    const reports = await prisma.report.findMany({
      where: {
        targetType,
        targetId,
        status: 'pending'
      }
    });

    if (reports.length === 0) {
      throw new Error('No pending reports found');
    }

    // Update all reports
    await prisma.report.updateMany({
      where: {
        targetType,
        targetId,
        status: 'pending'
      },
      data: {
        status: 'resolved',
        reviewedBy: moderatorId,
        reviewedAt: new Date(),
        notes
      }
    });

    // Remove content
    await this.removeContent(
      targetType as 'post' | 'comment',
      targetId,
      moderatorId,
      `Bulk approved: ${reports.length} reports`
    );

    // Log action
    await this.logAction(
      moderatorId,
      'bulk_approve',
      targetType,
      targetId,
      notes,
      { reportCount: reports.length }
    );

    return { processed: reports.length };
  }

  /**
   * Bulk reject reports for same target
   */
  async bulkRejectReports(targetType: string, targetId: string, moderatorId: string, notes?: string) {
    const result = await prisma.report.updateMany({
      where: {
        targetType,
        targetId,
        status: 'pending'
      },
      data: {
        status: 'rejected',
        reviewedBy: moderatorId,
        reviewedAt: new Date(),
        notes
      }
    });

    await this.logAction(
      moderatorId,
      'bulk_reject',
      targetType,
      targetId,
      notes,
      { reportCount: result.count }
    );

    return { processed: result.count };
  }

  // ============================================
  // AUDIT LOG
  // ============================================

  /**
   * Log a moderation action
   */
  private async logAction(
    moderatorId: string,
    action: string,
    targetType: string,
    targetId: string,
    reason?: string,
    metadata?: Record<string, unknown>
  ) {
    await prisma.moderationLog.create({
      data: {
        moderatorId,
        action,
        targetType,
        targetId,
        reason,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });
  }

  /**
   * Get moderation logs
   */
  async getModerationLogs(
    filters: {
      moderatorId?: string;
      action?: string;
      targetType?: string;
    } = {},
    limit = 50,
    offset = 0
  ) {
    const where: Record<string, unknown> = {};
    if (filters.moderatorId) where.moderatorId = filters.moderatorId;
    if (filters.action) where.action = filters.action;
    if (filters.targetType) where.targetType = filters.targetType;

    const [logs, total] = await Promise.all([
      prisma.moderationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.moderationLog.count({ where })
    ]);

    return { logs, total, limit, offset };
  }
}

export const moderationService = new ModerationService();
