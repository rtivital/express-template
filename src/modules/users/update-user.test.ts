import { prisma } from '@/prisma';
import { expectValidationError, Testdata } from '@/tests';
import { updateUser } from './update-user';

describe('update-user', () => {
  const testdata = new Testdata();

  it('updates an existing user with valid input', async () => {
    await prisma.$transaction(async (tx) => {
      const user = await testdata.createUser(tx);
      const newEmail = Testdata.randomEmail();
      const newName = 'Updated User';

      const updated = await updateUser({ id: user.id, email: newEmail, name: newName }, tx);
      expect(updated).toStrictEqual({ id: user.id, email: newEmail, name: newName });

      const found = await tx.user.findUnique({ where: { id: user.id } });
      expect(found).toStrictEqual({ id: user.id, email: newEmail, name: newName });

      await tx.user.delete({ where: { id: user.id } });
    });
  });

  it('throws an error when user does not exist', async () => {
    await prisma.$transaction(async (tx) => {
      await expect(
        updateUser({ id: -1, email: Testdata.randomEmail(), name: 'Name' }, tx)
      ).rejects.toThrow('User not found');
    });
  });

  it('throws a validation error for invalid payload', async () => {
    try {
      await updateUser({ id: 'invalid-id' as any, email: 'bad', name: 'A' } as any, prisma);
      fail('Expected updateUser to throw');
    } catch (error) {
      expectValidationError(error, 'id', 'Must be an integer');
      expectValidationError(error, 'email', 'Invalid email address');
      expectValidationError(error, 'name', 'Must be at least 2 characters');
    }
  });
});
