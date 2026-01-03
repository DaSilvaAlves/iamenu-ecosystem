import { PrismaClient } from '@prisma/client-marketplace';

const prisma = new PrismaClient();

interface QuoteRequestData {
  restaurantId: string; // Will come from auth token in a real app
  suppliers: string[];
  items: any[]; // JSON field
  deliveryFrequency?: string;
  deliveryAddress?: string;
  notes?: string;
  preferredStartDate?: Date;
}

interface RespondToQuoteRequestData {
  quoteRequestId: string;
  supplierId: string;
  items: any[];
  totalPrice?: number;
  deliveryDate?: Date;
  notes?: string;
}

export const createQuoteRequest = async (data: QuoteRequestData) => {
  const { restaurantId, suppliers, items, ...rest } = data;

  if (!restaurantId || !suppliers || !items) {
    throw new Error('restaurantId, suppliers, and items are required');
  }
  
  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      restaurantId,
      suppliers,
      items,
      ...rest,
    },
  });

  // Here you would typically trigger notifications to suppliers
  // e.g., via email, push notification, etc.

  return quoteRequest;
};

export const getMyQuoteRequests = async (restaurantId: string) => {
  return prisma.quoteRequest.findMany({
    where: {
      restaurantId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      quotes: true, // Include responses from suppliers
    },
  });
};

export const getIncomingQuoteRequests = async (supplierId: string) => {
  return prisma.quoteRequest.findMany({
    where: {
      suppliers: {
        has: supplierId, // Check if the supplierId is in the 'suppliers' array
      },
      status: {
        in: ['pending', 'quoted'], // Only show pending or already quoted requests
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      quotes: {
        where: {
          supplierId, // Only include quotes from this specific supplier
        },
      },
    },
  });
};

export const respondToQuoteRequest = async (data: RespondToQuoteRequestData) => {
  const { quoteRequestId, supplierId, items, ...rest } = data;

  // Validate that the supplier is actually requested for this quote
  const request = await prisma.quoteRequest.findUnique({
    where: { id: quoteRequestId },
  });

  if (!request || !request.suppliers.includes(supplierId)) {
    throw new Error('Quote request not found or supplier not authorized to respond');
  }

  const quote = await prisma.quote.create({
    data: {
      quoteRequestId,
      supplierId,
      items,
      ...rest,
      status: 'sent',
    },
  });

  // Update the status of the original QuoteRequest to 'quoted' if it was pending
  await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: {
      status: 'quoted',
    },
  });

  // Here you would typically notify the restaurant that a quote has been received.

  return quote;
};

export const getQuoteResponses = async (quoteRequestId: string) => {
  return prisma.quoteRequest.findUnique({
    where: { id: quoteRequestId },
    include: {
      quotes: {
        include: {
          supplier: true, // Include supplier details in each response
        },
      },
    },
  });
};

export const updateQuoteStatus = async (quoteId: string, newStatus: 'sent' | 'accepted' | 'rejected' | 'expired') => {
  const updatedQuote = await prisma.quote.update({
    where: { id: quoteId },
    data: { status: newStatus },
    include: { quoteRequest: true },
  });

  // If a quote is accepted, we might want to mark the parent quote request as accepted
  // or handle other business logic, like rejecting other quotes for the same request.
  if (newStatus === 'accepted') {
    await prisma.quoteRequest.update({
      where: { id: updatedQuote.quoteRequestId },
      data: { status: 'accepted' },
    });
    // Optional: Reject other quotes for this request
    await prisma.quote.updateMany({
      where: {
        quoteRequestId: updatedQuote.quoteRequestId,
        id: { not: quoteId },
        status: { not: 'accepted' }, // Don't reject if already accepted (shouldn't happen)
      },
      data: { status: 'rejected' },
    });
  }

  return updatedQuote;
};
