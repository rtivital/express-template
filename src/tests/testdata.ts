import { Prisma, User } from '@/generated/prisma/client';

export class Testdata {
  #createdUsers: User[];

  static randomEmail() {
    return `${Math.random()}@testdata.com`;
  }

  constructor() {
    this.#createdUsers = [];
  }

  async createUser(tx: Prisma.TransactionClient) {
    const user = await tx.user.create({
      data: {
        email: Testdata.randomEmail(),
        name: 'Testdata user',
      },
    });

    this.#createdUsers.push(user);

    return user;
  }

  async teardown(tx: Prisma.TransactionClient) {
    await tx.user.deleteMany({ where: { id: { in: this.#createdUsers.map((u) => u.id) } } });
  }
}
