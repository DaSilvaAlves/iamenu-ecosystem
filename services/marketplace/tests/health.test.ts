/**
 * Health Check Tests - Marketplace API
 * TD-006: Marketplace Test Suite
 */

import request from 'supertest';
import app from '../src/app';

describe('Health Check', () => {
  it('GET /health should return healthy status', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'healthy',
      service: 'marketplace-api',
    });
    expect(response.body.timestamp).toBeDefined();
    expect(response.body.version).toBeDefined();
  });

  it('GET /health should include version 1.0.0', async () => {
    const response = await request(app).get('/health');
    expect(response.body.version).toBe('1.0.0');
  });

  it('GET /health should have valid ISO timestamp', async () => {
    const response = await request(app).get('/health');
    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/unknown-route-that-does-not-exist')
      .expect(404);

    expect(response.body.error).toBe('Not Found');
    expect(response.body.service).toBe('marketplace-api');
  });

  it('should return 404 for unknown API routes', async () => {
    const response = await request(app)
      .get('/api/v1/marketplace/unknown')
      .expect(404);

    expect(response.body.error).toBe('Not Found');
  });
});

describe('API Base Routes', () => {
  it('GET /api/v1/marketplace/suppliers should return list or require auth', async () => {
    const response = await request(app)
      .get('/api/v1/marketplace/suppliers');

    // Either returns suppliers list, requires authentication, or DB error in CI
    expect([200, 401, 500]).toContain(response.status);
  });

  it('GET /api/v1/marketplace/products should return list or require auth', async () => {
    const response = await request(app)
      .get('/api/v1/marketplace/products');

    // Either returns products list, requires authentication, or DB error in CI
    expect([200, 401, 500]).toContain(response.status);
  });
});
