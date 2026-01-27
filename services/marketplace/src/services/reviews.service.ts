import prisma from '../lib/prisma';

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

// ===================================
// Update Review
// ===================================

interface UpdateReviewData {
  ratingOverall?: number;
  ratingQuality?: number;
  ratingDelivery?: number;
  ratingPrice?: number;
  ratingService?: number;
  comment?: string;
  recommend?: boolean;
  anonymous?: boolean;
}

export const updateReview = async (
  reviewId: string,
  reviewerId: string,
  data: UpdateReviewData
) => {
  // Check if review exists and belongs to the reviewer
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    return null;
  }

  if (existingReview.reviewerId !== reviewerId) {
    throw new Error('Unauthorized: You can only update your own reviews');
  }

  // Use transaction to update review and recalculate supplier rating
  return prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // Recalculate average rating for the supplier
    const aggregate = await tx.review.aggregate({
      _avg: { ratingOverall: true },
      _count: { id: true },
      where: { supplierId: existingReview.supplierId },
    });

    await tx.supplier.update({
      where: { id: existingReview.supplierId },
      data: {
        ratingAvg: aggregate._avg.ratingOverall || 0,
        reviewCount: aggregate._count.id,
      },
    });

    return updatedReview;
  });
};

// ===================================
// Delete Review
// ===================================

export const deleteReview = async (reviewId: string, reviewerId?: string) => {
  // Check if review exists
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    return null;
  }

  // If reviewerId is provided, verify ownership
  if (reviewerId && existingReview.reviewerId !== reviewerId) {
    throw new Error('Unauthorized: You can only delete your own reviews');
  }

  const supplierId = existingReview.supplierId;

  // Use transaction to delete review and recalculate supplier rating
  return prisma.$transaction(async (tx) => {
    await tx.review.delete({
      where: { id: reviewId },
    });

    // Recalculate average rating for the supplier
    const aggregate = await tx.review.aggregate({
      _avg: { ratingOverall: true },
      _count: { id: true },
      where: { supplierId },
    });

    await tx.supplier.update({
      where: { id: supplierId },
      data: {
        ratingAvg: aggregate._avg.ratingOverall || 0,
        reviewCount: aggregate._count.id,
      },
    });

    return { deleted: true, reviewId };
  });
};

// ===================================
// Mark Review as Helpful/Unhelpful
// ===================================

export const markAsHelpful = async (
  reviewId: string,
  helpful: boolean // true = helpful, false = unhelpful
) => {
  // Check if review exists
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    return null;
  }

  // Increment the appropriate counter
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: helpful
      ? { helpfulCount: { increment: 1 } }
      : { unhelpfulCount: { increment: 1 } },
  });

  return updatedReview;
};

// ===================================
// Add Supplier Response to Review
// ===================================

export const addSupplierResponse = async (
  reviewId: string,
  supplierId: string,
  response: string
) => {
  // Check if review exists and belongs to the supplier
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    return null;
  }

  if (existingReview.supplierId !== supplierId) {
    throw new Error('Unauthorized: You can only respond to reviews on your profile');
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      supplierResponse: response,
      supplierResponseAt: new Date(),
    },
  });

  return updatedReview;
};
