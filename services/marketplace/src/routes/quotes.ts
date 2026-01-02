import { Router } from 'express';
import * as quoteController from '../controllers/quotes.controller';
// import { authenticateJWT } from '../../src/middleware/auth';

const router = Router();

// This endpoint is for creating a new quote request
// In a real app, this should be protected by authentication
// router.post('/request', authenticateJWT, quoteController.createNewQuoteRequest);
router.post('/request', quoteController.createNewQuoteRequest);

// This endpoint is for a restaurant to get their own quote requests
// router.get('/requests', authenticateJWT, quoteController.getMyQuoteRequests);
router.get('/requests', quoteController.getMyQuoteRequests);

// This endpoint is for a supplier to get their incoming quote requests
// router.get('/incoming', authenticateJWT, quoteController.getIncomingQuoteRequests);
router.get('/incoming', quoteController.getIncomingQuoteRequests);

// This endpoint is for a supplier to respond to a specific quote request
// router.post('/:id/respond', authenticateJWT, quoteController.respondToQuoteRequest);
router.post('/:id/respond', quoteController.respondToQuoteRequest);

export default router;
