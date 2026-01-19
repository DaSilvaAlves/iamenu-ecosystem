import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ReviewData {
  supplierId: string;
  reviewerId: string;
  ratingOverall: number;
  ratingQuality: number;
  ratingDelivery: number;
  ratingPrice: number;
  ratingService: number;
  comment?: string;
  recommend?: boolean;
  anonymous?: boolean;
}

export const createReview = async (data: ReviewData) => {
  // Use a transaction to create the review and update the supplier's average rating
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.upsert({
      where: {
        supplierId_reviewerId: {
          supplierId: data.supplierId,
          reviewerId: data.reviewerId,
        },
      },
      update: { ...data },
      create: { ...data },
    });

    // Recalculate average rating for the supplier
    const aggregate = await tx.review.aggregate({
      _avg: {
        ratingOverall: true,
      },
      _count: {
        id: true,
      },
      where: {
        supplierId: data.supplierId,
      },
    });

    const newAvgRating = aggregate._avg.ratingOverall || 0;
    const newReviewCount = aggregate._count.id;

    await tx.supplier.update({
      where: {
        id: data.supplierId,
      },
      data: {
        ratingAvg: newAvgRating,
        reviewCount: newReviewCount,
      },
    });

    return review;
  });
};

export const getReviewsForSupplier = async (supplierId: string, limit: number = 20, offset: number = 0) => {
  const reviews = await prisma.review.findMany({
    where: {
      supplierId,
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.review.count({ where: { supplierId } });

  return {
    reviews,
    total,
    limit,
    offset,
  };
};

// TODO: Implement updateReview, deleteReview, markAsHelpful
