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
  });
});
