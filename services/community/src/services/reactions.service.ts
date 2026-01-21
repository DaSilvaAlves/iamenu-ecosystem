import prisma from '../lib/prisma';

export class ReactionsService {
  /**
   * Toggle reaction (add or remove)
   * Works for both posts and comments
   */
  async toggleReaction(
    userId: string,
    targetType: 'post' | 'comment',
    targetId: string,
    reactionType: 'like' | 'useful' | 'thanks'
  ) {
    // Check if reaction already exists
    const existing = await prisma.reaction.findFirst({
      where: {
        userId,
        targetType,
        targetId,
        reactionType,
      },
    });

    if (existing) {
      // Remove reaction
      await prisma.reaction.delete({
        where: { id: existing.id },
      });
      return { action: 'removed' };
    } else {
      // Add reaction
      await prisma.reaction.create({
        data: {
          userId,
          targetType,
          targetId,
          reactionType,
        },
      });
      return { action: 'added' };
    }
  }

  /**
   * Get reaction counts for a target (post or comment)
   */
  async getReactionCounts(targetType: 'post' | 'comment', targetId: string) {
    const reactions = await prisma.reaction.groupBy({
      by: ['reactionType'],
      where: {
        targetType,
        targetId,
      },
      _count: {
        reactionType: true,
      },
    });

    const counts: Record<string, number> = {};
    reactions.forEach((r) => {
      counts[r.reactionType] = r._count.reactionType;
    });

    return counts;
  }

  /**
   * Get user's reactions for multiple targets
   */
  async getUserReactions(
    userId: string,
    targetType: 'post' | 'comment',
    targetIds: string[]
  ) {
    const reactions = await prisma.reaction.findMany({
      where: {
        userId,
        targetType,
        targetId: { in: targetIds },
      },
    });

    return reactions;
  }
}

export const reactionsService = new ReactionsService();
