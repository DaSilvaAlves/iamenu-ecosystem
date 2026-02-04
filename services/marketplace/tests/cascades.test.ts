/**
 * Cascade Delete Tests - Marketplace API
 * TD-006: Marketplace Test Suite
 *
 * Verifies onDelete cascade rules from TD-004:
 * - BargainAdhesion → CollectiveBargain: CASCADE
 * - PriceHistory → Product: CASCADE
 * - PriceHistory → Supplier: CASCADE
 */

import prisma from '../src/lib/prisma';
import { Prisma } from '../generated/prisma';

describe('Cascade Delete Rules', () => {
  // Test data IDs for cleanup
  let testSupplierId: string;
  let testProductId: string;
  let testBargainId: string;

  beforeEach(async () => {
    // Clean up any existing test data
    await prisma.priceHistory.deleteMany({
      where: { productId: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.bargainAdhesion.deleteMany({
      where: { id: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.collectiveBargain.deleteMany({
      where: { id: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.supplierProduct.deleteMany({
      where: { productId: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.product.deleteMany({
      where: { id: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.supplier.deleteMany({
      where: { id: { startsWith: 'test-' } }
    }).catch(() => {});
  });

  afterAll(async () => {
    // Final cleanup
    await prisma.priceHistory.deleteMany({
      where: { productId: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.bargainAdhesion.deleteMany({
      where: { id: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.collectiveBargain.deleteMany({
      where: { id: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.supplierProduct.deleteMany({
      where: { productId: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.product.deleteMany({
      where: { id: { startsWith: 'test-' } }
    }).catch(() => {});
    await prisma.supplier.deleteMany({
      where: { id: { startsWith: 'test-' } }
    }).catch(() => {});
  });

  describe('PriceHistory → Product CASCADE', () => {
    it('should cascade delete price history when product is deleted', async () => {
      // Create test product
      const product = await prisma.product.create({
        data: {
          id: 'test-product-cascade-1',
          name: 'Test Product for Cascade',
          category: 'test',
        }
      });
      testProductId = product.id;

      // Create test supplier (needed for price history)
      const supplier = await prisma.supplier.create({
        data: {
          id: 'test-supplier-cascade-1',
          userId: 'test-user-cascade',
          companyName: 'Test Supplier for Cascade',
        }
      });
      testSupplierId = supplier.id;

      // Create price history
      await prisma.priceHistory.create({
        data: {
          productId: product.id,
          supplierId: supplier.id,
          price: new Prisma.Decimal('10.99'),
          date: new Date(),
        }
      });

      // Verify price history exists
      let historyCount = await prisma.priceHistory.count({
        where: { productId: product.id }
      });
      expect(historyCount).toBe(1);

      // Delete the product
      await prisma.product.delete({ where: { id: product.id } });

      // Verify price history was cascade deleted
      historyCount = await prisma.priceHistory.count({
        where: { productId: product.id }
      });
      expect(historyCount).toBe(0);

      // Cleanup supplier
      await prisma.supplier.delete({ where: { id: supplier.id } });
    });
  });

  describe('PriceHistory → Supplier CASCADE', () => {
    it('should cascade delete price history when supplier is deleted', async () => {
      // Create test supplier
      const supplier = await prisma.supplier.create({
        data: {
          id: 'test-supplier-cascade-2',
          userId: 'test-user-cascade-2',
          companyName: 'Test Supplier 2 for Cascade',
        }
      });

      // Create test product
      const product = await prisma.product.create({
        data: {
          id: 'test-product-cascade-2',
          name: 'Test Product 2 for Cascade',
          category: 'test',
        }
      });

      // Create price history
      await prisma.priceHistory.create({
        data: {
          productId: product.id,
          supplierId: supplier.id,
          price: new Prisma.Decimal('25.50'),
          date: new Date(),
        }
      });

      // Verify price history exists
      let historyCount = await prisma.priceHistory.count({
        where: { supplierId: supplier.id }
      });
      expect(historyCount).toBe(1);

      // Delete the supplier (should cascade to price history)
      await prisma.supplier.delete({ where: { id: supplier.id } });

      // Verify price history was cascade deleted
      historyCount = await prisma.priceHistory.count({
        where: { supplierId: supplier.id }
      });
      expect(historyCount).toBe(0);

      // Cleanup product
      await prisma.product.delete({ where: { id: product.id } });
    });
  });

  describe('BargainAdhesion → CollectiveBargain CASCADE', () => {
    it('should cascade delete adhesions when collective bargain is deleted', async () => {
      // Create test collective bargain
      const bargain = await prisma.collectiveBargain.create({
        data: {
          id: 'test-bargain-cascade-1',
          creatorId: 'test-creator-cascade',
          productName: 'Test Bargain Product',
          status: 'open',
        }
      });

      // Create adhesion
      await prisma.bargainAdhesion.create({
        data: {
          id: 'test-adhesion-cascade-1',
          collectiveBargainId: bargain.id,
          userId: 'test-user-adhesion',
          committedQuantity: new Prisma.Decimal('100'),
        }
      });

      // Verify adhesion exists
      let adhesionCount = await prisma.bargainAdhesion.count({
        where: { collectiveBargainId: bargain.id }
      });
      expect(adhesionCount).toBe(1);

      // Delete the collective bargain
      await prisma.collectiveBargain.delete({ where: { id: bargain.id } });

      // Verify adhesion was cascade deleted
      adhesionCount = await prisma.bargainAdhesion.count({
        where: { collectiveBargainId: bargain.id }
      });
      expect(adhesionCount).toBe(0);
    });

    it('should cascade delete multiple adhesions', async () => {
      // Create test collective bargain
      const bargain = await prisma.collectiveBargain.create({
        data: {
          id: 'test-bargain-cascade-2',
          creatorId: 'test-creator-cascade-2',
          productName: 'Test Bargain Product 2',
          status: 'open',
        }
      });

      // Create multiple adhesions
      await prisma.bargainAdhesion.createMany({
        data: [
          {
            id: 'test-adhesion-cascade-2a',
            collectiveBargainId: bargain.id,
            userId: 'test-user-1',
            committedQuantity: new Prisma.Decimal('50'),
          },
          {
            id: 'test-adhesion-cascade-2b',
            collectiveBargainId: bargain.id,
            userId: 'test-user-2',
            committedQuantity: new Prisma.Decimal('75'),
          },
          {
            id: 'test-adhesion-cascade-2c',
            collectiveBargainId: bargain.id,
            userId: 'test-user-3',
            committedQuantity: new Prisma.Decimal('25'),
          },
        ]
      });

      // Verify all adhesions exist
      let adhesionCount = await prisma.bargainAdhesion.count({
        where: { collectiveBargainId: bargain.id }
      });
      expect(adhesionCount).toBe(3);

      // Delete the collective bargain
      await prisma.collectiveBargain.delete({ where: { id: bargain.id } });

      // Verify all adhesions were cascade deleted
      adhesionCount = await prisma.bargainAdhesion.count({
        where: { collectiveBargainId: bargain.id }
      });
      expect(adhesionCount).toBe(0);
    });
  });

  describe('No Orphan Records', () => {
    it('should not leave orphan records after cascade delete', async () => {
      // Create a full test scenario
      const supplier = await prisma.supplier.create({
        data: {
          id: 'test-supplier-orphan',
          userId: 'test-user-orphan',
          companyName: 'Test Orphan Supplier',
        }
      });

      const product = await prisma.product.create({
        data: {
          id: 'test-product-orphan',
          name: 'Test Orphan Product',
          category: 'test',
        }
      });

      // Create multiple price history entries
      await prisma.priceHistory.createMany({
        data: [
          { productId: product.id, supplierId: supplier.id, price: new Prisma.Decimal('10.00'), date: new Date('2024-01-01') },
          { productId: product.id, supplierId: supplier.id, price: new Prisma.Decimal('10.50'), date: new Date('2024-02-01') },
          { productId: product.id, supplierId: supplier.id, price: new Prisma.Decimal('11.00'), date: new Date('2024-03-01') },
        ]
      });

      // Delete product first
      await prisma.product.delete({ where: { id: product.id } });

      // Check no orphan price history exists
      const orphanHistory = await prisma.priceHistory.findMany({
        where: { productId: product.id }
      });
      expect(orphanHistory.length).toBe(0);

      // Delete supplier
      await prisma.supplier.delete({ where: { id: supplier.id } });

      // Verify complete cleanup
      const supplierExists = await prisma.supplier.findUnique({ where: { id: supplier.id } });
      expect(supplierExists).toBeNull();
    });
  });
});
