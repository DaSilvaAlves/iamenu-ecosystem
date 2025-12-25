import { PrismaClient } from '@prisma/client';
import {
  ACHIEVEMENTS,
  calculateLevel,
  getXPForNextLevel,
  getXPForCurrentLevel,
  calculateBaseXP,
  calculateTotalXP,
  getUnlockedAchievements,
  type Achievement,
  type UserStats
} from '../config/achievements';

const prisma = new PrismaClient();

/**
 * Gamification Service
 * Handles badges, levels, and XP calculations
 */
export class GamificationService {
  /**
   * Check and award new badges to a user
   * Returns newly unlocked achievements
   */
  async checkAndAwardBadges(userId: string): Promise<Achievement[]> {
    // Get user stats
    const stats = await this.getUserStats(userId);

    // Get current badges
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    const currentBadges: string[] = profile?.badges
      ? JSON.parse(profile.badges)
      : [];

    // Check which achievements are unlocked
    const unlockedAchievements = getUnlockedAchievements(stats);
    const unlockedIds = unlockedAchievements.map(a => a.id);

    // Find newly earned badges
    const newBadges = unlockedIds.filter(id => !currentBadges.includes(id));

    if (newBadges.length > 0) {
      // Update profile with new badges
      await prisma.profile.update({
        where: { userId },
        data: {
          badges: JSON.stringify(unlockedIds),
        },
      });
    }

    // Return newly unlocked achievements
    return ACHIEVEMENTS.filter(a => newBadges.includes(a.id));
  }

  /**
   * Get user stats for gamification
   */
  async getUserStats(userId: string): Promise<UserStats> {
    const [postsCount, commentsCount, reactionsReceived] = await Promise.all([
      // Count posts by user
      prisma.post.count({
        where: { authorId: userId },
      }),
      // Count comments by user
      prisma.comment.count({
        where: { authorId: userId },
      }),
      // Count reactions on user's posts
      prisma.reaction.count({
        where: {
          targetType: 'post',
          targetId: {
            in: await prisma.post.findMany({
              where: { authorId: userId },
              select: { id: true },
            }).then(posts => posts.map(p => p.id)),
          },
        },
      }),
    ]);

    return {
      postsCount,
      commentsCount,
      reactionsReceived,
    };
  }

  /**
   * Get complete gamification data for a user
   */
  async getGamificationData(userId: string) {
    const stats = await this.getUserStats(userId);

    // Get current badges
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    const unlockedBadgeIds: string[] = profile?.badges
      ? JSON.parse(profile.badges)
      : [];

    // Calculate XP and level
    const totalXP = calculateTotalXP(stats, unlockedBadgeIds);
    const level = calculateLevel(totalXP);
    const xpForCurrentLevel = getXPForCurrentLevel(level);
    const xpForNextLevel = getXPForNextLevel(level);
    const xpProgress = totalXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;

    // Get unlocked achievements with full data
    const unlockedBadges = ACHIEVEMENTS.filter(a =>
      unlockedBadgeIds.includes(a.id)
    );

    // Get locked achievements with progress
    const lockedAchievements = ACHIEVEMENTS.filter(a =>
      !unlockedBadgeIds.includes(a.id)
    ).map(achievement => ({
      ...achievement,
      progress: this.calculateAchievementProgress(achievement, stats),
    }));

    return {
      level,
      totalXP,
      xpProgress,
      xpNeeded,
      xpForNextLevel,
      unlockedBadges,
      lockedAchievements,
      stats,
    };
  }

  /**
   * Calculate progress towards an achievement (0-100%)
   */
  private calculateAchievementProgress(achievement: Achievement, stats: UserStats): number {
    // Simple heuristic based on achievement ID
    if (achievement.id.startsWith('posts-')) {
      const target = parseInt(achievement.id.split('-')[1]);
      return Math.min(100, Math.floor((stats.postsCount / target) * 100));
    }
    if (achievement.id.startsWith('comments-')) {
      const target = parseInt(achievement.id.split('-')[1]);
      return Math.min(100, Math.floor((stats.commentsCount / target) * 100));
    }
    if (achievement.id.startsWith('reactions-')) {
      const target = parseInt(achievement.id.split('-')[1]);
      return Math.min(100, Math.floor((stats.reactionsReceived / target) * 100));
    }

    // For combined achievements, check if condition is met
    return achievement.condition(stats) ? 100 : 0;
  }

  /**
   * Get all available achievements (for display purposes)
   */
  getAllAchievements(): Achievement[] {
    return ACHIEVEMENTS;
  }
}

export const gamificationService = new GamificationService();
