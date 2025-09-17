import { prisma } from '@/prisma';
import { Testdata } from '@/tests';
import { getUserById } from './get-user-by-id';

describe('get-user-by-id', () => {
  const testdata = new Testdata();

  it('creates a new user with valid input', async () => {
    await prisma.$transaction(async (tx) => {
      const user = await testdata.createUser(tx);

      const result = await getUserById({ id: user.id }, tx);
      expect(result).toStrictEqual(user);

      await testdata.teardown(tx);
    });
  });

  it('returns null if user does not exist', async () => {
    await prisma.$transaction(async (tx) => {
      const result = await getUserById({ id: -1 }, tx);
      expect(result).toBeNull();
    });
  });
});
