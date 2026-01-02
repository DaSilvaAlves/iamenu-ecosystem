import { Request, Response } from 'express';
import * as quoteService from '../services/quotes.service';

export const createNewQuoteRequest = async (req: Request, res: Response) => {
  try {
    // In a real app, restaurantId would come from the authenticated user
    const { restaurantId, ...quoteData } = req.body;

    if (!restaurantId) {
      return res.status(400).json({ message: 'restaurantId is required' });
    }

    const createdRequest = await quoteService.createQuoteRequest({
      restaurantId,
      ...quoteData,
    });
    res.status(201).json(createdRequest);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating quote request', error: error.message });
  }
};

export const getMyQuoteRequests = async (req: Request, res: Response) => {
  try {
    // In a real app, restaurantId would come from the authenticated user (e.g., req.user.id)
    // For now, we'll get it from a query parameter for testing.
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ message: 'restaurantId query parameter is required' });
    }

    const requests = await quoteService.getMyQuoteRequests(restaurantId as string);
    res.status(200).json(requests);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching quote requests', error: error.message });
  }
};

export const getIncomingQuoteRequests = async (req: Request, res: Response) => {
  try {
    // In a real app, supplierId would come from the authenticated user
    // For now, we'll get it from a query parameter for testing.
    const { supplierId } = req.query;

    if (!supplierId) {
      return res.status(400).json({ message: 'supplierId query parameter is required' });
    }

    const requests = await quoteService.getIncomingQuoteRequests(supplierId as string);
    res.status(200).json(requests);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching incoming quote requests', error: error.message });
  }
};

export const respondToQuoteRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // quoteRequestId
    // In a real app, supplierId would come from the authenticated user
    const { supplierId, ...quoteResponseData } = req.body;

    if (!supplierId) {
      return res.status(400).json({ message: 'supplierId is required in the body' });
    }

    const createdQuote = await quoteService.respondToQuoteRequest({
      quoteRequestId: id,
      supplierId,
      ...quoteResponseData,
    });
    res.status(201).json(createdQuote);
  } catch (error: any) {
    res.status(500).json({ message: 'Error responding to quote request', error: error.message });
  }
};
