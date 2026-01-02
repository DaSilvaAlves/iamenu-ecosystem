import { PrismaClient } from '@prisma/client-marketplace';

const prisma = new PrismaClient();

export const getCollectiveBargains = async () => {
  const collectiveBargains = await prisma.collectiveBargain.findMany({
    include: {
      // Assuming a relation to Product model exists and is named 'Product'
      // This part might need adjustment based on the final schema relation name
      // Product: true, 
      // Assuming a relation to BargainAdhesion model exists and is named 'BargainAdhesions'
      // BargainAdhesions: true, 
    },
    orderBy: {
      deadline: 'asc',
    },
  });

  // The logic for processing bargains was complex and might need data that is not available
  // in the current simplified schema (e.g., BargainAdhesions, Product price).
  // For now, we return the raw data and will enhance it later.
  // A simple mapping to show the structure:
  const processedBargains = collectiveBargains.map(bargain => {
    return {
      ...bargain,
      // Placeholder values for calculated fields
      currentParticipants: bargain.participants.length,
      totalCommittedVolume: 0, // This needs BargainAdhesions to be calculated
      isActive: bargain.deadline ? new Date(bargain.deadline) > new Date() : false,
      isAchieved: bargain.status === 'closed-achieved', // Simplified logic
    };
  });

  return processedBargains;
};
