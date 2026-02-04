/**
 * Health Check Tests - Business API
 * INF-002: Test Coverage Expansion
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
      service: 'business-api',
    });
    expect(response.body.timestamp).toBeDefined();
    expect(response.body.version).toBeDefined();
    expect(response.body.uptime).toBeDefined();
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

  it('GET /health should include uptime', async () => {
    const response = await request(app).get('/health');
    expect(typeof response.body.uptime).toBe('number');
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/unknown-route-that-does-not-exist')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Route not found');
  });

  it('should return 404 for unknown API routes', async () => {
    const response = await request(app)
      .get('/api/v1/business/unknown')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Route not found');
  });
});

describe('API Test Endpoint', () => {
  it('GET /api/v1/business/test should return API info', async () => {
    const response = await request(app)
      .get('/api/v1/business/test')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'iaMenu Business API is running!',
    });
    expect(response.body.endpoints).toBeDefined();
    expect(Array.isArray(response.body.endpoints)).toBe(true);
    expect(response.body.endpoints.length).toBeGreaterThan(0);
  });
});
