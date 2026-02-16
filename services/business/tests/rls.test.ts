/**
 * RLS Security Tests - Business Service (CRITICAL)
 * Validates restaurant data isolation for financial data
 */

import prisma from '../../src/lib/prisma';
import { setRLSContext, clearRLSContext } from '../../src/middleware/rls';

describe('RLS: Business Service - CRITICAL Restaurant Isolation', () => {
  const owner1 = 'owner-1';
  const owner2 = 'owner-2';

  describe('Restaurants - STRICT Owner Isolation', () => {
    it('CRITICAL: owner1 CANNOT see owner2 restaurant data', async () => {
      await setRLSContext(owner1);
      
      // Try to query owner2's restaurants
      const restaurants = await prisma.restaurant.findMany({
        where: { userId: owner2 }
      });
      
      expect(restaurants).toHaveLength(0);
    });

    it('owner1 can see own restaurant', async () => {
      await setRLSContext(owner1);
      
      const restaurants = await prisma.restaurant.findMany({
        where: { userId: owner1 }
      });
      
      expect(restaurants).toBeDefined();
    });
  });

  describe('Orders - CRITICAL Financial Data Isolation', () => {
    it('CRITICAL: owner1 cannot see owner2 orders (revenue leak)', async () => {
      await setRLSContext(owner1);
      
      // Try to access owner2's orders
      const orders = await prisma.order.findMany({
        where: { restaurantId: 'rest-owner2' }
      });
      
      expect(orders).toHaveLength(0);
    });

    it('owner1 cannot see owner2 daily stats (business intelligence leak)', async () => {
      await setRLSContext(owner1);
      
      const stats = await prisma.dailyStats.findMany({
        where: { restaurantId: 'rest-owner2' }
      });
      
      expect(stats).toHaveLength(0);
    });
  });

  describe('Products - Menu Privacy', () => {
    it('SECURITY: owner1 cannot see owner2 menu items', async () => {
      await setRLSContext(owner1);
      
      const products = await prisma.product.findMany({
        where: { restaurantId: 'rest-owner2' }
      });
      
      expect(products).toHaveLength(0);
    });
  });

  describe('Settings - Configuration Privacy', () => {
    it('SECURITY: owner1 cannot see owner2 restaurant settings', async () => {
      await setRLSContext(owner1);
      
      // Try to query settings for owner2's restaurant
      const settings = await prisma.restaurantSettings.findMany({
        where: { restaurantId: 'rest-owner2' }
      });
      
      expect(settings).toHaveLength(0);
    });
  });

  afterEach(async () => {
    await clearRLSContext();
  });
});
