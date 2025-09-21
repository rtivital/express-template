import request from 'supertest';
import { app } from '@/app';
import { User } from '@/generated/prisma/client';
import { prisma } from '@/prisma';
import { appRequest, appRequestWithAuth, expectValidationError, Testdata } from '@/tests';
import { PaginatedResult } from '@/utils/paginate';

describe('users-controller', () => {
  const testdata = new Testdata();

  afterAll(async () => {
    await testdata.teardown(prisma);
  });

  describe('GET /api/v1/users', () => {
    it('returns paginated users with defaults', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth<PaginatedResult<User>>({
        email: user.email,
        url: '/api/v1/users',
        method: 'get',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);
      expect(response.body.data.length).toBeLessThanOrEqual(10);
      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(10);
    });

    it('returns 422 for invalid query params', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: '/api/v1/users?page=0',
        method: 'get',
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('message', 'Validation Error');
      expectValidationError(response.body, 'page');
    });
  });

  describe('POST /api/v1/users', () => {
    it('creates a user and sets session', async () => {
      const email = Testdata.randomEmail();
      const name = 'New User';

      const createRes = await appRequest<{ id: number; email: string; name: string }>({
        url: '/api/v1/users',
        method: 'post',
        payload: { email, name },
      });

      expect(createRes.status).toBe(201);
      expect(createRes.body).toStrictEqual({ id: expect.any(Number), email, name });
      const cookie = createRes.headers['set-cookie'];
      expect(cookie).toBeDefined();

      const protectedRes = await request(app).get('/api/v1/users').set('Cookie', cookie);
      if (protectedRes.status !== 200) {
        console.log(
          'Protected GET /api/v1/users response:',
          protectedRes.status,
          protectedRes.body
        );
      }

      expect(protectedRes.status).toBe(200);

      await prisma.user.delete({ where: { id: createRes.body.id } });
    });

    it('returns 422 for invalid body', async () => {
      const response = await appRequest({
        url: '/api/v1/users',
        method: 'post',
        payload: { email: 'invalid-email', name: 'N' },
      });

      expect(response.status).toBe(422);
      expectValidationError(response.body, 'email', 'Invalid email address');
      expectValidationError(response.body, 'name', 'Must be at least 2 characters');
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('returns existing user', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: `/api/v1/users/${user.id}`,
        method: 'get',
      });

      expect(response.body).toStrictEqual(user);
    });

    it('returns 422 for invalid id', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: '/api/v1/users/invalid-id',
        method: 'get',
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('message', 'Validation Error');
      expectValidationError(response.body, 'id', 'Must be an integer');
    });

    it('returns 404 for non-existing user', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: '/api/v1/users/-1',
        method: 'get',
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('updates existing user', async () => {
      const user = await testdata.createUser();
      const newName = 'Updated Name';
      const newEmail = Testdata.randomEmail();
      const response = await appRequestWithAuth({
        email: user.email,
        url: `/api/v1/users/${user.id}`,
        method: 'put',
        payload: {
          name: newName,
          email: newEmail,
        },
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('name', newName);
      expect(response.body).toHaveProperty('email', newEmail);
    });

    it('returns 422 for invalid id', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: '/api/v1/users/invalid-id',
        method: 'put',
        payload: {
          name: 'New Name',
          email: Testdata.randomEmail(),
        },
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('message', 'Validation Error');
      expectValidationError(response.body, 'id', 'Must be an integer');
    });

    it('returns 422 for invalid body', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: `/api/v1/users/${user.id}`,
        method: 'put',
        payload: {
          name: 'N',
          email: 'invalid-email',
        },
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('message', 'Validation Error');
      expectValidationError(response.body, 'name', 'Must be at least 2 characters');
      expectValidationError(response.body, 'email', 'Invalid email address');
    });

    it('returns 404 for non-existing user', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: '/api/v1/users/-1',
        method: 'put',
        payload: {
          name: 'New Name',
          email: Testdata.randomEmail(),
        },
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('deletes existing user', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: `/api/v1/users/${user.id}`,
        method: 'delete',
      });

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(user);

      const found = await prisma.user.findUnique({ where: { id: user.id } });
      expect(found).toBeNull();
    });

    it('returns 422 for invalid id', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: '/api/v1/users/invalid-id',
        method: 'delete',
      });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('message', 'Validation Error');
      expectValidationError(response.body, 'id', 'Must be an integer');
    });

    it('returns 404 for non-existing user', async () => {
      const user = await testdata.createUser();

      const response = await appRequestWithAuth({
        email: user.email,
        url: '/api/v1/users/-1',
        method: 'delete',
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
});
