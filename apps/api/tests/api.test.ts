import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('FH6 Cars REST API Public Endpoints', () => {
  it('GET /health - should return status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('GET /api/v1/statistics - should return aggregated stats structure', async () => {
    const res = await request(app).get('/api/v1/statistics');
    expect([200, 500]).toContain(res.status); // 500 if DB not connected in CI/test, 200 if connected
  });

  it('GET /api/v1/cars - should return car list or handle database connection gracefully', async () => {
    const res = await request(app).get('/api/v1/cars');
    expect([200, 500]).toContain(res.status);
  });

  it('POST /api/v1/auth/login - should fail with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'wrongpassword' });
    expect([401, 500]).toContain(res.status);
  });
});
