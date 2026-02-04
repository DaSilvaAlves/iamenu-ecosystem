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
      service: 'community-api',
    });
    expect(response.body.timestamp).toBeDefined();
  });

  it('GET /health should include version', async () => {
    const response = await request(app).get('/health');
    expect(response.body.version).toBeDefined();
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/unknown-route')
      .expect(404);

    expect(response.body.error).toBe('Not Found');
  });
});
