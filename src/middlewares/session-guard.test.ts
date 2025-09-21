import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/prisma';
import { appRequest, appRequestWithAuth, Testdata } from '@/tests';

describe('session-guard', () => {
  const testdata = new Testdata();

  afterAll(async () => {
    await testdata.teardown(prisma);
  });

  it('returns 401 when no session', async () => {
    const res = await appRequest<{ message: string }>({ url: '/api/v1/users', method: 'get' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('allows requests with valid session', async () => {
    const user = await testdata.createUser();

    const res = await appRequestWithAuth<{
      data: Array<{ id: number; email: string; name: string }>;
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>({
      email: user.email,
      url: '/api/v1/users',
      method: 'get',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns 401 when session user does not exist', async () => {
    const user = await testdata.createUser();

    // Log in to establish a session cookie
    const loginRes = await request(app).post('/api/v1/users/login').send({ email: user.email });
    const cookie = loginRes.headers['set-cookie'];
    expect(cookie).toBeDefined();

    // Delete the user so the session points to a non-existing user
    await prisma.user.delete({ where: { id: user.id } });

    // Now perform an authenticated request with the stale session
    const res = await request(app).get('/api/v1/users').set('Cookie', cookie);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});
