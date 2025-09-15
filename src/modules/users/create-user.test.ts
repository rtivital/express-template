import { prisma } from '@/prisma';
import { createUser } from './create-user';

describe('create-user', () => {
  it('creates a new user with valid input', async () => {
    await prisma.$transaction(async (tx) => {
      const email = `${Math.random()}@example.com`;
      const name = 'Test User';

      const createdUser = await createUser({ email, name }, tx);
      expect(createdUser).toStrictEqual({ id: expect.any(Number), email, name });

      const user = await tx.user.findUnique({ where: { email } });
      expect(user).toStrictEqual({ id: expect.any(Number), email, name });

      await tx.user.delete({ where: { id: createdUser.id } });
    });
  });
});
