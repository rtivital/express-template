import request from 'supertest';
import { app } from '@/app';

describe('trailing-slash-redirect', () => {
  it('redirects url with trailing slash to url without trailing slash', async () => {
    const res = await request(app).get('/health/');
    expect(res.status).toBe(307);
    expect(res.header['location']).toBe('/health');
  });

  it('does not redirect url without trailing slash', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('does not redirect root url', async () => {
    const res = await request(app).get('/');
    expect(res.status).not.toBe(307);
  });

  it('does not redirect /docs/', async () => {
    const res = await request(app).get('/docs/');
    expect(res.status).not.toBe(307);
  });

  it('does not redirect /docs', async () => {
    const res = await request(app).get('/docs');
    expect(res.status).not.toBe(307);
  });
});
