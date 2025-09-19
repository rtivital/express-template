import { prisma } from '@/prisma';
import { expectValidationError, Testdata } from '@/tests';
import { deleteUser } from './delete-user';

describe('delete-user', () => {
  const testdata = new Testdata();

  it('deletes an existing user', async () => {
    await prisma.$transaction(async (tx) => {
      const user = await testdata.createUser(tx);

      const deleted = await deleteUser({ id: user.id }, tx);
      expect(deleted).toStrictEqual(user);

      const found = await tx.user.findUnique({ where: { id: user.id } });
      expect(found).toBeNull();
    });
  });

  it('throws an error when user does not exist', async () => {
    await prisma.$transaction(async (tx) => {
      await expect(deleteUser({ id: -1 }, tx)).rejects.toThrow('User not found');
    });
  });

  it('throws a validation error for invalid payload', async () => {
    try {
      await deleteUser({ id: 'not-an-int' as any } as any, prisma);
      fail('Expected deleteUser to throw');
    } catch (error) {
      expectValidationError(error, 'id', 'Must be an integer');
    }
  });
});
