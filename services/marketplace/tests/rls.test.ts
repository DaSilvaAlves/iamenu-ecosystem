/**
 * RLS Security Tests - Marketplace Service
 * Validates supplier/buyer data isolation
 */

import prisma from '../../src/lib/prisma';
import { setRLSContext, clearRLSContext } from '../../src/middleware/rls';

describe('RLS: Marketplace Service - Data Isolation', () => {
  const supplier1 = 'supplier-1';
  const supplier2 = 'supplier-2';
  const buyer1 = 'buyer-1';
  const buyer2 = 'buyer-2';

  // ============================================
  // TEST SUITE 1: SUPPLIER PROFILE ISOLATION
  // ============================================

  describe('Suppliers - Profile Access Control', () => {
    it('SECURITY: buyer1 cannot see supplier1 private profile', async () => {
      await setRLSContext(buyer1);
      
      // Try to query supplier1 non-verified profile
      const suppliers = await prisma.supplier.findMany({
        where: { verified: false }
      });
      
      // Should not see non-verified suppliers
      expect(suppliers.map(s => s.id)).not.toContain('supplier-1');
    });

    it('supplier1 can see own full profile', async () => {
      await setRLSContext(supplier1);
      
      const suppliers = await prisma.supplier.findMany();
      // Should find own supplier profile
      expect(suppliers.some(s => s.userId === supplier1)).toBe(true);
    });
  });

  // ============================================
  // TEST SUITE 2: QUOTES - CRITICAL ISOLATION
  // ============================================

  describe('Quotes - Supplier/Buyer Separation', () => {
    it('SECURITY: buyer1 cannot see quotes for buyer2 requests', async () => {
      await setRLSContext(buyer1);
      
      // Try to query quotes for buyer2's requests
      const quotes = await prisma.quote.findMany({
        where: {
          quoteRequest: {
            restaurantId: buyer2
          }
        }
      });
      
      // RLS should block this
      expect(quotes).toHaveLength(0);
    });

    it('SECURITY: supplier1 cannot see quotes from supplier2', async () => {
      await setRLSContext(supplier1);
      
      // Try to query supplier2's quotes
      const quotes = await prisma.quote.findMany({
        where: {
          supplier: {
            userId: supplier2
          }
        }
      });
      
      // RLS should block this
      expect(quotes.filter(q => q.supplierId.includes(supplier2))).toHaveLength(0);
    });
  });

  // ============================================
  // TEST SUITE 3: QUOTE REQUESTS - BUYER PRIVACY
  // ============================================

  describe('Quote Requests - Buyer Privacy', () => {
    it('SECURITY: buyer1 cannot see buyer2 quote requests', async () => {
      await setRLSContext(buyer1);
      
      // Try to query buyer2's requests
      const requests = await prisma.quoteRequest.findMany({
        where: { restaurantId: buyer2 }
      });
      
      expect(requests).toHaveLength(0);
    });
  });

  // ============================================
  // TEST SUITE 4: REVIEWS - PUBLIC DATA
  // ============================================

  describe('Reviews - Public Access', () => {
    it('All users can see reviews (public data)', async () => {
      await setRLSContext(buyer1);
      
      // Should be able to view reviews
      const reviews = await prisma.review.findMany();
      expect(reviews).toBeDefined();
    });

    it('SECURITY: User cannot edit other users reviews', async () => {
      await setRLSContext(buyer1);
      
      const result = await prisma.review.updateMany({
        where: { reviewerId: buyer2 },
        data: { comment: 'Hacked!' }
      });
      
      // RLS blocks this
      expect(result.count).toBe(0);
    });
  });

  // ============================================
  // TEST SUITE 5: COLLECTIVE BARGAINS
  // ============================================

  describe('Collective Bargains - Participant Isolation', () => {
    it('buyer1 cannot see private bargains of buyer2', async () => {
      await setRLSContext(buyer1);
      
      // Try to see bargains where buyer2 is creator/participant
      const bargains = await prisma.collectiveBargain.findMany({
        where: {
          creatorId: buyer2
        }
      });
      
      // Should not see private bargains
      expect(bargains).toHaveLength(0);
    });
  });

  afterEach(async () => {
    await clearRLSContext();
  });
});
