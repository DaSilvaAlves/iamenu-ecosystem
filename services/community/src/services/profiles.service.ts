import { PrismaClient } from '@prisma/client';
import { gamificationService } from './gamification.service';
import { followersService } from './followers.service';

const prisma = new PrismaClient();

export interface UpdateProfileDto {
  restaurantName?: string;
  locationCity?: string;
  locationRegion?: string;
  restaurantType?: string;
  bio?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  badges?: string;
}

/**
 * Profiles Service
 * Handles all database operations for user profiles
 */
export class ProfilesService {
  /**
   * Get profile by userId
   */
  async getProfile(userId: string) {
    let profile = await prisma.profile.findUnique({
      where: { userId },
    });

    // Create profile if doesn't exist
    if (!profile) {
      profile = await prisma.profile.create({
        data: { userId },
      });
    }

    return profile;
  }

  /**
   * Update profile
   */
  async updateProfile(userId: string, data: UpdateProfileDto) {
    // Upsert (create or update)
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    return profile;
  }

  /**
   * Get user statistics (posts, comments, reactions received, followers, following)
   */
  async getUserStats(userId: string) {
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

    // Get gamification data (level, XP, badges)
    const gamificationData = await gamificationService.getGamificationData(userId);

    // Get followers/following counts
    const followCounts = await followersService.getFollowCounts(userId);

    return {
      postsCount,
      commentsCount,
      reactionsReceived,
      followersCount: followCounts.followersCount,
      followingCount: followCounts.followingCount,
      // Gamification data
      level: gamificationData.level,
      totalXP: gamificationData.totalXP,
      xpProgress: gamificationData.xpProgress,
      xpNeeded: gamificationData.xpNeeded,
      xpForNextLevel: gamificationData.xpForNextLevel,
      unlockedBadges: gamificationData.unlockedBadges,
    };
  }

  /**
   * Search profiles by username
   */
  async searchProfiles(query: string, limit = 10) {
    const profiles = await prisma.profile.findMany({
      where: {
        username: {
          contains: query,
        },
      },
      select: {
        userId: true,
        username: true,
        restaurantName: true,
        profilePhoto: true,
      },
      take: limit,
      orderBy: { username: 'asc' },
    });

    return profiles;
  }

  /**
   * Get user's posts
   */
  async getUserPosts(userId: string, limit = 10, offset = 0) {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    const total = await prisma.post.count({
      where: { authorId: userId },
    });

    return {
      posts,
      total,
      limit,
      offset,
    };
  }
}

export const profilesService = new ProfilesService();
