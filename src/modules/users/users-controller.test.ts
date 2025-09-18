// import supertest from 'supertest';
// import { app } from '@/app';
import { prisma } from '@/prisma';
import { appRequestWithAuth, Testdata } from '@/tests';

describe('users-controller', () => {
  const testdata = new Testdata();

  afterAll(async () => {
    await testdata.teardown(prisma);
  });

  test('GET /api/v1/users/:id | returns existing user', async () => {
    const user = await testdata.createUser();

    const response = await appRequestWithAuth({
      email: user.email,
      url: `/api/v1/users/${user.id}`,
      method: 'get',
    });

    expect(response.body).toStrictEqual(user);
  });
});
