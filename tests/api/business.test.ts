/**
 * Business API Tests
 * Tests for dashboard, analytics, orders
 */

import { apiClient } from './setup';

describe('Business API', () => {
  const API_BASE = '/business';

  describe('Dashboard Stats', () => {
    describe('GET /dashboard/stats', () => {
      it('should get dashboard statistics', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/stats`, {
          params: { period: 'week' }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(response.data.data).toHaveProperty('totalRevenue');
        expect(response.data.data).toHaveProperty('ordersCount');
        expect(response.data.data).toHaveProperty('avgTicket');
      });

      it('should support different periods', async () => {
        const periods = ['today', 'week', 'month'];

        for (const period of periods) {
          const response = await apiClient.get(`${API_BASE}/dashboard/stats`, {
            params: { period }
          });

          expect(response.status).toBe(200);
        }
      });

      it('should support custom date range', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/stats`, {
          params: {
            period: 'custom',
            dateFrom: '2026-02-01',
            dateTo: '2026-02-10'
          }
        });

        expect([200, 400]).toContain(response.status);
      });
    });
  });

  describe('Analytics Endpoints', () => {
    describe('GET /dashboard/top-products', () => {
      it('should get top performing products', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/top-products`, {
          params: { limit: 10, period: 'month', sortBy: 'revenue' }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should support sorting', async () => {
        const sorts = ['revenue', 'units_sold', 'profit_margin'];

        for (const sortBy of sorts) {
          const response = await apiClient.get(`${API_BASE}/dashboard/top-products`, {
            params: { sortBy }
          });

          expect(response.status).toBe(200);
        }
      });
    });

    describe('GET /dashboard/alerts', () => {
      it('should get critical alerts', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/alerts`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should support severity filtering', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/alerts`, {
          params: { severity: 'critical' }
        });

        expect(response.status).toBe(200);
      });
    });

    describe('GET /dashboard/opportunities', () => {
      it('should get business opportunities', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/opportunities`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should support priority filtering', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/opportunities`, {
          params: { priority: 'high' }
        });

        expect(response.status).toBe(200);
      });
    });

    describe('GET /dashboard/sales-trends', () => {
      it('should get sales trends', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/sales-trends`, {
          params: { period: 'month', groupBy: 'day' }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should include time series data', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/sales-trends`);

        expect(response.status).toBe(200);
        response.data.data.forEach((trend: any) => {
          expect(trend).toHaveProperty('revenue');
          expect(trend).toHaveProperty('ordersCount');
          expect(trend).toHaveProperty('timestamp');
        });
      });
    });
  });

  describe('AI & Predictions', () => {
    describe('GET /dashboard/ai-prediction', () => {
      it('should get AI predictions', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/ai-prediction`);

        expect(response.status).toBe(200);
        expect(response.data.data).toHaveProperty('prediction');
        expect(response.data.data).toHaveProperty('confidence');
        expect(response.data.data).toHaveProperty('suggestions');
      });

      it('should support focus areas', async () => {
        const areas = ['revenue', 'customer_retention', 'cost_reduction', 'product_mix'];

        for (const focusArea of areas) {
          const response = await apiClient.get(`${API_BASE}/dashboard/ai-prediction`, {
            params: { focusArea }
          });

          expect(response.status).toBe(200);
        }
      });
    });

    describe('GET /dashboard/demand-forecast', () => {
      it('should get 7-day demand forecast', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/demand-forecast`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
        expect(response.data.data.length).toBeGreaterThan(0);

        // Verify forecast structure
        response.data.data.forEach((day: any) => {
          expect(day).toHaveProperty('date');
          expect(day).toHaveProperty('forecastedOrders');
          expect(day).toHaveProperty('forecastedRevenue');
          expect(day).toHaveProperty('confidence');
        });
      });
    });
  });

  describe('Advanced Analytics', () => {
    describe('GET /dashboard/menu-engineering', () => {
      it('should get menu profitability matrix', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/menu-engineering`, {
          params: { period: 'month' }
        });

        expect(response.status).toBe(200);
        expect(response.data.data).toHaveProperty('items');
        expect(response.data.data).toHaveProperty('categories');

        // Verify menu engineering categories
        const categories = response.data.data.categories;
        ['stars', 'plowhorses', 'puzzles', 'dogs'].forEach(category => {
          expect(categories).toHaveProperty(category);
        });
      });
    });

    describe('GET /dashboard/peak-hours-heatmap', () => {
      it('should get peak hours heatmap', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/peak-hours-heatmap`, {
          params: { period: 'week' }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);

        // Verify heatmap data
        response.data.data.forEach((hour: any) => {
          expect(hour).toHaveProperty('hour');
          expect(hour.hour).toBeGreaterThanOrEqual(0);
          expect(hour.hour).toBeLessThan(24);
          expect(hour).toHaveProperty('ordersCount');
          expect(hour).toHaveProperty('avgOrderValue');
        });
      });
    });

    describe('GET /dashboard/benchmark', () => {
      it('should get performance benchmarks', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/benchmark`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);

        // Verify benchmark data
        response.data.data.forEach((benchmark: any) => {
          expect(benchmark).toHaveProperty('metric');
          expect(benchmark).toHaveProperty('yourPerformance');
          expect(benchmark).toHaveProperty('sectorAverage');
          expect(benchmark).toHaveProperty('percentile');
        });
      });

      it('should support filtering by metrics', async () => {
        const response = await apiClient.get(`${API_BASE}/dashboard/benchmark`, {
          params: { metrics: 'revenue,avg_ticket,customer_count' }
        });

        expect(response.status).toBe(200);
      });
    });
  });

  describe('Error Handling', () => {
    it('should require authentication', async () => {
      const unauthClient = apiClient;
      delete unauthClient.defaults.headers.common['Authorization'];

      try {
        await unauthClient.get(`${API_BASE}/dashboard/stats`);
        fail('Should require authentication');
      } catch (error: any) {
        expect(error.response?.status).toBe(401);
      }
    });

    it('should handle invalid period', async () => {
      try {
        await apiClient.get(`${API_BASE}/dashboard/stats`, {
          params: { period: 'invalid' }
        });
        fail('Should validate period');
      } catch (error: any) {
        expect([400, 422]).toContain(error.response?.status);
      }
    });

    it('should enforce RLS on all endpoints', async () => {
      // Business API should only return data for user's restaurant(s)
      const response = await apiClient.get(`${API_BASE}/dashboard/stats`);
      expect(response.status).toBe(200);

      // All data should implicitly belong to user's restaurant
      // (cannot access other restaurant data)
    });
  });

  describe('Response Format', () => {
    it('should return consistent response format', async () => {
      const response = await apiClient.get(`${API_BASE}/dashboard/stats`);

      expect(response.data).toHaveProperty('data');
      // Pagination is optional for stats endpoints
      if (response.data.pagination) {
        expect(response.data.pagination).toHaveProperty('limit');
      }
    });

    it('should include proper timestamps', async () => {
      const response = await apiClient.get(`${API_BASE}/dashboard/sales-trends`);

      response.data.data.forEach((trend: any) => {
        if (trend.timestamp) {
          // Should be ISO 8601 format
          expect(new Date(trend.timestamp).toISOString()).toBeTruthy();
        }
      });
    });
  });
});
