import prisma from '../lib/prisma';
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

// Points awarded for different actions
const POINTS_CONFIG = {
  POST_CREATED: 10,
  COMMENT_ADDED: 2,
  REACTION_RECEIVED: 5,
  STREAK_BONUS_7: 50,   // 7-day streak bonus
  STREAK_BONUS_30: 200, // 30-day streak bonus
};

/**
 * Gamification Service
 * Handles badges, levels, XP, points, and streaks
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

  // ============================================
  // POINTS SYSTEM
  // ============================================

  /**
   * Award points to a user for an action
   */
  async awardPoints(
    userId: string,
    points: number,
    reason: string,
    referenceId?: string
  ): Promise<void> {
    // Record in points history
    await prisma.pointsHistory.create({
      data: {
        userId,
        points,
        reason,
        referenceId,
      },
    });

    // Update user points cache
    await this.updateUserPointsCache(userId);

    // Update streak
    await this.updateStreak(userId);
  }

  /**
   * Award points when a post is created
   */
  async onPostCreated(userId: string, postId: string): Promise<void> {
    await this.awardPoints(userId, POINTS_CONFIG.POST_CREATED, 'post_created', postId);
    await this.checkAndAwardBadges(userId);
  }

  /**
   * Award points when a comment is added
   */
  async onCommentAdded(userId: string, commentId: string): Promise<void> {
    await this.awardPoints(userId, POINTS_CONFIG.COMMENT_ADDED, 'comment_added', commentId);
    await this.checkAndAwardBadges(userId);
  }

  /**
   * Award points when a reaction is received
   */
  async onReactionReceived(userId: string, reactionId: string): Promise<void> {
    await this.awardPoints(userId, POINTS_CONFIG.REACTION_RECEIVED, 'reaction_received', reactionId);
    await this.checkAndAwardBadges(userId);
  }

  /**
   * Update the cached user points
   */
  private async updateUserPointsCache(userId: string): Promise<void> {
    // Calculate total XP from history
    const totalPoints = await prisma.pointsHistory.aggregate({
      where: { userId },
      _sum: { points: true },
    });

    const totalXP = totalPoints._sum.points || 0;
    const level = calculateLevel(totalXP);

    // Upsert user points
    await prisma.userPoints.upsert({
      where: { userId },
      update: {
        totalXP,
        level,
        lastActiveAt: new Date(),
      },
      create: {
        userId,
        totalXP,
        level,
        currentStreak: 0,
        longestStreak: 0,
      },
    });
  }

  /**
   * Update user streak
   */
  private async updateStreak(userId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Record today's activity
    await prisma.userStreak.upsert({
      where: {
        userId_date: { userId, date: today },
      },
      update: {
        actionsCount: { increment: 1 },
      },
      create: {
        userId,
        date: today,
        actionsCount: 1,
      },
    });

    // Calculate current streak
    const streaks = await prisma.userStreak.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 60, // Check last 60 days max
    });

    let currentStreak = 0;
    const checkDate = new Date(today);

    for (const streak of streaks) {
      const streakDate = new Date(streak.date);
      streakDate.setHours(0, 0, 0, 0);

      if (streakDate.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Update user points with streak
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    const longestStreak = Math.max(currentStreak, userPoints?.longestStreak || 0);

    await prisma.userPoints.update({
      where: { userId },
      data: {
        currentStreak,
        longestStreak,
      },
    });

    // Award streak bonuses
    if (currentStreak === 7) {
      await this.awardPoints(userId, POINTS_CONFIG.STREAK_BONUS_7, 'streak_bonus_7');
    } else if (currentStreak === 30) {
      await this.awardPoints(userId, POINTS_CONFIG.STREAK_BONUS_30, 'streak_bonus_30');
    }
  }

  /**
   * Get points history for a user
   */
  async getPointsHistory(userId: string, limit = 50) {
    return prisma.pointsHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // ============================================
  // LEADERBOARD
  // ============================================

  /**
   * Get global leaderboard
   */
  async getLeaderboard(limit = 50, offset = 0) {
    const users = await prisma.userPoints.findMany({
      orderBy: { totalXP: 'desc' },
      take: limit,
      skip: offset,
    });

    // Get profiles for these users
    const userIds = users.map(u => u.userId);
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        username: true,
        restaurantName: true,
        profilePhoto: true,
        badges: true,
      },
    });

    const profileMap = new Map(profiles.map(p => [p.userId, p]));

    return users.map((user, index) => {
      const profile = profileMap.get(user.userId);
      const badgeCount = profile?.badges ? JSON.parse(profile.badges).length : 0;

      return {
        rank: offset + index + 1,
        userId: user.userId,
        username: profile?.username || 'Anonymous',
        restaurantName: profile?.restaurantName,
        profilePhoto: profile?.profilePhoto,
        totalXP: user.totalXP,
        level: user.level,
        currentStreak: user.currentStreak,
        badgeCount,
      };
    });
  }

  /**
   * Get user's rank in leaderboard
   */
  async getUserRank(userId: string): Promise<number> {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    if (!userPoints) return 0;

    const rank = await prisma.userPoints.count({
      where: {
        totalXP: { gt: userPoints.totalXP },
      },
    });

    return rank + 1;
  }

  /**
   * Get users around a specific user in leaderboard
   */
  async getLeaderboardAroundUser(userId: string, range = 5) {
    const userRank = await this.getUserRank(userId);
    if (userRank === 0) return [];

    const offset = Math.max(0, userRank - range - 1);
    return this.getLeaderboard(range * 2 + 1, offset);
  }
}

export const gamificationService = new GamificationService();
