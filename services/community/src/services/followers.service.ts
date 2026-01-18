import { PrismaClient } from '../../prisma/generated/client';

const prisma = new PrismaClient();

/**
 * Followers Service
 * Handles all database operations for followers/following relationships
 */
export class FollowersService {
  /**
   * Follow a user
   */
  async followUser(followerId: string, followingId: string) {
    // Can't follow yourself
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    // Check if already following
    const existing = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existing) {
      throw new Error('Already following this user');
    }

    // Create follow relationship
    const follower = await prisma.follower.create({
      data: {
        followerId,
        followingId,
      },
    });

    return follower;
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(followerId: string, followingId: string) {
    const deleted = await prisma.follower.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });

    if (deleted.count === 0) {
      throw new Error('Not following this user');
    }

    return { success: true };
  }

  /**
   * Check if user A is following user B
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return !!follow;
  }

  /**
   * Get list of followers for a user
   */
  async getFollowers(userId: string, limit: number = 50, offset: number = 0) {
    const [followers, total] = await Promise.all([
      prisma.follower.findMany({
        where: { followingId: userId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.follower.count({
        where: { followingId: userId },
      }),
    ]);

    return {
      followers: followers.map((f) => f.followerId),
      total,
      limit,
      offset,
    };
  }

  /**
   * Get list of users that a user is following
   */
  async getFollowing(userId: string, limit: number = 50, offset: number = 0) {
    const [following, total] = await Promise.all([
      prisma.follower.findMany({
        where: { followerId: userId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.follower.count({
        where: { followerId: userId },
      }),
    ]);

    return {
      following: following.map((f) => f.followingId),
      total,
      limit,
      offset,
    };
  }

  /**
   * Get follower and following counts for a user
   */
  async getFollowCounts(userId: string) {
    const [followersCount, followingCount] = await Promise.all([
      prisma.follower.count({
        where: { followingId: userId },
      }),
      prisma.follower.count({
        where: { followerId: userId },
      }),
    ]);

    return {
      followersCount,
      followingCount,
    };
  }
}

export const followersService = new FollowersService();
