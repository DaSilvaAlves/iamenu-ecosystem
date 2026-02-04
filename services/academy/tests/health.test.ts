/**
 * Health Check Tests - Academy API
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
      service: 'academy-api',
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
    expect(response.body.service).toBe('academy-api');
  });

  it('should return 404 for unknown API routes', async () => {
    const response = await request(app)
      .get('/api/v1/academy/unknown')
      .expect(404);

    expect(response.body.error).toBe('Not Found');
  });
});

describe('API Info Endpoint', () => {
  it('GET /api/v1/academy should return API info', async () => {
    const response = await request(app)
      .get('/api/v1/academy')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      service: 'iaMenu Academy API',
      version: '1.0.0',
    });
    expect(response.body.endpoints).toBeDefined();
    expect(response.body.endpoints.courses).toBe('/api/v1/academy/courses');
    expect(response.body.endpoints.enrollments).toBe('/api/v1/academy/enrollments');
    expect(response.body.endpoints.certificates).toBe('/api/v1/academy/certificates');
  });
});
