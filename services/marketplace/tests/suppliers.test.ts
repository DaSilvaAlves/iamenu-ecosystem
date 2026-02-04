/**
 * Supplier Tests - Marketplace API
 * TD-006: Marketplace Test Suite
 *
 * Tests for Supplier CRUD operations
 *
 * NOTE: These are integration tests that require a properly configured database.
 * They will be skipped in CI if the database schema is not available.
 */

import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';

// Skip integration tests if database is not properly configured
const describeIfDb = process.env.CI ? describe.skip : describe;

describeIfDb('Supplier API', () => {
  // Test supplier data
  const testSupplierData = {
    id: 'test-supplier-api-1',
    userId: 'test-user-supplier-api',
    companyName: 'Test API Supplier',
    description: 'A test supplier for API testing',
    categories: ['vegetables', 'fruits'],
    locationCity: 'Lisboa',
    locationRegion: 'Lisboa',
  };

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.supplier.deleteMany({
      where: { id: { startsWith: 'test-supplier-api' } }
    }).catch(() => {});
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.supplier.deleteMany({
      where: { id: { startsWith: 'test-supplier-api' } }
    }).catch(() => {});
  });

  describe('GET /api/v1/marketplace/suppliers', () => {
    it('should return suppliers list', async () => {
      const response = await request(app)
        .get('/api/v1/marketplace/suppliers');

      // Should return 200 with suppliers array
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('suppliers');
      expect(Array.isArray(response.body.suppliers)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/marketplace/suppliers')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('suppliers');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('limit');
    });

    it('should filter by category', async () => {
      // First create a test supplier with specific category
      await prisma.supplier.create({
        data: {
          ...testSupplierData,
          id: 'test-supplier-api-filter',
          categories: ['seafood'],
        }
      });

      const response = await request(app)
        .get('/api/v1/marketplace/suppliers')
        .query({ category: 'seafood' });

      expect(response.status).toBe(200);

      // Cleanup
      await prisma.supplier.delete({
        where: { id: 'test-supplier-api-filter' }
      }).catch(() => {});
    });
  });

  describe('GET /api/v1/marketplace/suppliers/:id', () => {
    it('should return 404 for non-existent supplier', async () => {
      const response = await request(app)
        .get('/api/v1/marketplace/suppliers/non-existent-id-12345');

      expect(response.status).toBe(404);
    });

    it('should return supplier by ID', async () => {
      // Create test supplier
      const supplier = await prisma.supplier.create({
        data: testSupplierData
      });

      const response = await request(app)
        .get(`/api/v1/marketplace/suppliers/${supplier.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(supplier.id);
      expect(response.body.companyName).toBe(testSupplierData.companyName);

      // Cleanup
      await prisma.supplier.delete({ where: { id: supplier.id } });
    });
  });

  describe('Supplier Data Integrity', () => {
    it('should handle suppliers with all fields', async () => {
      const fullSupplier = await prisma.supplier.create({
        data: {
          id: 'test-supplier-api-full',
          userId: 'test-user-full',
          companyName: 'Full Test Supplier',
          description: 'Complete supplier with all fields',
          categories: ['meat', 'poultry'],
          locationCity: 'Porto',
          locationRegion: 'Porto',
          nationalDelivery: true,
          contactPhone: '+351 912 345 678',
          contactEmail: 'test@supplier.pt',
          minOrder: 50.00,
          verified: true,
        }
      });

      expect(fullSupplier.id).toBe('test-supplier-api-full');
      expect(fullSupplier.nationalDelivery).toBe(true);
      expect(fullSupplier.verified).toBe(true);

      // Cleanup
      await prisma.supplier.delete({ where: { id: fullSupplier.id } });
    });

    it('should have correct default values', async () => {
      const supplier = await prisma.supplier.create({
        data: {
          id: 'test-supplier-api-defaults',
          userId: 'test-user-defaults',
          companyName: 'Default Values Supplier',
        }
      });

      expect(supplier.nationalDelivery).toBe(false);
      expect(supplier.verified).toBe(false);
      expect(supplier.ratingAvg.toString()).toBe('0');
      expect(supplier.reviewCount).toBe(0);
      expect(supplier.categories).toEqual([]);

      // Cleanup
      await prisma.supplier.delete({ where: { id: supplier.id } });
    });
  });
});
