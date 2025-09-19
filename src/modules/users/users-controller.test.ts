import { prisma } from '@/prisma';
import { appRequestWithAuth, expectValidationError, Testdata } from '@/tests';

describe('users-controller', () => {
  const testdata = new Testdata();

  afterAll(async () => {
    await testdata.teardown(prisma);
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
});
