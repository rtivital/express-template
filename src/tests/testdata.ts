import { Prisma, User } from '@/generated/prisma/client';
import { prisma } from '@/prisma';

export class Testdata {
  #createdUsers: User[];
  #tx: Prisma.TransactionClient;

  static randomEmail() {
    return `${Math.random()}@testdata.com`;
  }

  constructor(tx?: Prisma.TransactionClient) {
    this.#createdUsers = [];
    this.#tx = tx || prisma;
  }

  async createUser(tx?: Prisma.TransactionClient) {
    const client = tx || this.#tx;
    const user = await client.user.create({
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
