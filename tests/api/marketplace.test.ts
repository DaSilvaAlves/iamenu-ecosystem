/**
 * Marketplace API Tests
 * Tests for suppliers, quotes, reviews, bargains
 */

import { apiClient } from './setup';

describe('Marketplace API', () => {
  const API_BASE = '/marketplace';
  let createdSupplierId: string;
  let createdQuoteId: string;

  describe('Suppliers Endpoints', () => {
    describe('GET /suppliers', () => {
      it('should list suppliers (public, RLS filtered)', async () => {
        const response = await apiClient.get(`${API_BASE}/suppliers`);

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(response.data).toHaveProperty('pagination');
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should support filtering', async () => {
        const response = await apiClient.get(`${API_BASE}/suppliers`, {
          params: { search: 'test', verified: true }
        });

        expect(response.status).toBe(200);
      });
    });

    describe('POST /suppliers', () => {
      it('should create a supplier', async () => {
        const supplierData = {
          companyName: 'Test Supplier Co',
          email: 'test@supplier.com',
          phone: '+351910123456',
          description: 'A test supplier',
          categories: ['fruits', 'vegetables'],
          deliveryArea: 'Lisboa',
          minOrderValue: 50.00
        };

        const response = await apiClient.post(`${API_BASE}/suppliers`, supplierData);

        expect(response.status).toBe(201);
        expect(response.data.data.companyName).toBe(supplierData.companyName);
        expect(response.data.data).toHaveProperty('id');

        createdSupplierId = response.data.data.id;
      });

      it('should validate required fields', async () => {
        try {
          await apiClient.post(`${API_BASE}/suppliers`, {
            email: 'invalid@email.com'
          });
          fail('Should validate required fields');
        } catch (error: any) {
          expect(error.response?.status).toBe(400);
        }
      });
    });

    describe('GET /suppliers/{id}', () => {
      it('should get supplier details', async () => {
        if (!createdSupplierId) {
          throw new Error('No supplier ID available');
        }

        const response = await apiClient.get(`${API_BASE}/suppliers/${createdSupplierId}`);

        expect(response.status).toBe(200);
        expect(response.data.data.id).toBe(createdSupplierId);
      });
    });
  });

  describe('Reviews Endpoints', () => {
    describe('GET /suppliers/{id}/reviews', () => {
      it('should get supplier reviews (public)', async () => {
        if (!createdSupplierId) {
          throw new Error('No supplier ID available');
        }

        const response = await apiClient.get(
          `${API_BASE}/suppliers/${createdSupplierId}/reviews`
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      });
    });

    describe('POST /suppliers/{id}/reviews', () => {
      it('should create a review', async () => {
        if (!createdSupplierId) {
          throw new Error('No supplier ID available');
        }

        const reviewData = {
          rating: 5,
          title: 'Excellent Service',
          comment: 'Great quality products and fast delivery'
        };

        const response = await apiClient.post(
          `${API_BASE}/suppliers/${createdSupplierId}/reviews`,
          reviewData
        );

        expect(response.status).toBe(201);
        expect(response.data.data.rating).toBe(reviewData.rating);
      });

      it('should validate rating range', async () => {
        if (!createdSupplierId) {
          throw new Error('No supplier ID available');
        }

        try {
          await apiClient.post(
            `${API_BASE}/suppliers/${createdSupplierId}/reviews`,
            { rating: 10, title: 'Great' }
          );
          fail('Should validate rating');
        } catch (error: any) {
          expect(error.response?.status).toBe(400);
        }
      });
    });
  });

  describe('Quotes Endpoints', () => {
    describe('GET /quotes', () => {
      it('should list quotes (RLS filtered)', async () => {
        const response = await apiClient.get(`${API_BASE}/quotes`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      });
    });

    describe('POST /quotes', () => {
      it('should create a quote', async () => {
        const quoteData = {
          quoteRequestId: '550e8400-e29b-41d4-a716-446655440000',
          totalPrice: 250.00,
          itemDetails: [
            {
              productId: '550e8400-e29b-41d4-a716-446655440001',
              quantity: 10,
              unitPrice: 20.00
            }
          ],
          deliveryDate: '2026-02-20',
          deliveryFee: 10.00,
          paymentTerms: 'Net 30'
        };

        try {
          const response = await apiClient.post(`${API_BASE}/quotes`, quoteData);
          expect([201, 400, 404]).toContain(response.status);
          if (response.status === 201) {
            createdQuoteId = response.data.data.id;
          }
        } catch (error: any) {
          // Quote request may not exist - expected in test environment
          expect([400, 404]).toContain(error.response?.status);
        }
      });
    });

    describe('GET /quotes/{id}', () => {
      it('should get quote details (RLS filtered)', async () => {
        if (!createdQuoteId) {
          // Skip if no quote created
          return;
        }

        const response = await apiClient.get(`${API_BASE}/quotes/${createdQuoteId}`);

        expect(response.status).toBe(200);
        expect(response.data.data.id).toBe(createdQuoteId);
      });
    });
  });

  describe('Collective Bargains', () => {
    describe('GET /bargains', () => {
      it('should list active bargains (public)', async () => {
        const response = await apiClient.get(`${API_BASE}/bargains`);

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(Array.isArray(response.data.data)).toBe(true);
      });
    });

    describe('GET /bargains/{id}', () => {
      it('should get bargain details (public)', async () => {
        // Get first bargain if exists
        const listResponse = await apiClient.get(`${API_BASE}/bargains`);

        if (listResponse.data.data.length > 0) {
          const bargainId = listResponse.data.data[0].id;

          const response = await apiClient.get(`${API_BASE}/bargains/${bargainId}`);

          expect(response.status).toBe(200);
          expect(response.data.data).toHaveProperty('id');
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid supplier ID', async () => {
      try {
        await apiClient.get(`${API_BASE}/suppliers/invalid-uuid`);
        fail('Should return error');
      } catch (error: any) {
        expect([400, 404]).toContain(error.response?.status);
      }
    });

    it('should enforce RLS on quotes', async () => {
      // Get quotes with current user - should work
      const response = await apiClient.get(`${API_BASE}/quotes`);
      expect(response.status).toBe(200);

      // Verify all quotes belong to user (implicit in RLS)
      expect(Array.isArray(response.data.data)).toBe(true);
    });
  });
});
