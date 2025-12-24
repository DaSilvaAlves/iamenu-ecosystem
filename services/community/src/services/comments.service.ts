import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateCommentDto {
  postId: string;
  authorId: string;
  body: string;
}

/**
 * Comments Service
 * Business logic for post comments
 */
export class CommentsService {
  /**
   * Get comments for a post
   */
  async getCommentsByPostId(postId: string, limit: number = 20, offset: number = 0) {
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({
        where: { postId },
      }),
    ]);

    return {
      comments,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Create new comment
   */
  async createComment(data: CreateCommentDto) {
    const comment = await prisma.comment.create({
      data: {
        postId: data.postId,
        authorId: data.authorId,
        body: data.body,
      },
    });

    return comment;
  }

  /**
   * Delete comment
   */
  async deleteComment(id: string, authorId: string) {
    // Verify ownership
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== authorId) {
      throw new Error('Unauthorized');
    }

    await prisma.comment.delete({
      where: { id },
    });

    return { success: true };
  }
}

export const commentsService = new CommentsService();
