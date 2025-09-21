import { prisma } from '@/prisma';
import { Testdata } from '@/tests';
import { getUsers } from './get-users';

describe('get-users', () => {
  it('returns paginated users', async () => {
    await prisma.$transaction(async (tx) => {
      const testdata = new Testdata(tx);
      await testdata.createUsers(25);
      const totalUsers = await tx.user.count();

      const result = await getUsers({ page: 2, pageSize: 10 }, tx);
      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(totalUsers);
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(3);

      await testdata.teardown();
    });
  });

  it('uses default pagination params', async () => {
    await prisma.$transaction(async (tx) => {
      const testdata = new Testdata(tx);
      await testdata.createUsers(15);
      const totalUsers = await tx.user.count();

      const result = await getUsers({ page: undefined, pageSize: undefined }, tx);
      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(totalUsers);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(2);

      await testdata.teardown();
    });
  });

  it('throws error for invalid pagination params', async () => {
    await expect(getUsers({ page: 0, pageSize: 10 })).rejects.toThrow();
    await expect(getUsers({ page: 1, pageSize: 0.4 })).rejects.toThrow();
  });
});
