import { prisma } from '@/prisma';
import { Testdata } from '@/tests';
import { createUser } from './create-user';

describe('create-user', () => {
  const testdata = new Testdata();

  it('creates a new user with valid input', async () => {
    await prisma.$transaction(async (tx) => {
      const email = Testdata.randomEmail();
      const name = 'Test User';

      const createdUser = await createUser({ email, name }, tx);
      expect(createdUser).toStrictEqual({ id: expect.any(Number), email, name });

      const user = await tx.user.findUnique({ where: { email } });
      expect(user).toStrictEqual({ id: expect.any(Number), email, name });

      await tx.user.delete({ where: { id: createdUser.id } });
    });
  });

  it('throws an error when user with the same email already exists', async () => {
    await prisma.$transaction(async (tx) => {
      const existingUser = await testdata.createUser(tx);

      await expect(
        createUser({ email: existingUser.email, name: 'Another User' }, tx)
      ).rejects.toThrow('User with this email already exists');
    });
  });
});
