import { prisma } from '@/prisma';
import { Testdata } from '@/tests';
import { getUserByEmail } from './get-user-by-email';

describe('get-user-by-email', () => {
  const testdata = new Testdata();

  it('creates a new user with valid input', async () => {
    await prisma.$transaction(async (tx) => {
      const user = await testdata.createUser(tx);

      const result = await getUserByEmail({ email: user.email }, tx);
      expect(result).toStrictEqual(user);

      await testdata.teardown(tx);
    });
  });

  it('returns null if user does not exist', async () => {
    await prisma.$transaction(async (tx) => {
      const result = await getUserByEmail({ email: 'nonexistent@example.com' }, tx);
      expect(result).toBeNull();
    });
  });
});
