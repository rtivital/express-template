import { Prisma, User } from '@/generated/prisma/client';
import { prisma } from '@/prisma';

export class Testdata {
  #tx: Prisma.TransactionClient;
  users: User[];

  static randomEmail() {
    return `${Math.random()}@testdata.com`;
  }

  constructor(tx?: Prisma.TransactionClient) {
    this.users = [];
    this.#tx = tx || prisma;
  }

  async createUser(tx: Prisma.TransactionClient = this.#tx): Promise<User> {
    const user = await tx.user.create({
      data: {
        email: Testdata.randomEmail(),
        name: 'Testdata user',
      },
    });

    this.users.push(user);

    return user;
  }

  async createUsers(count: number, tx: Prisma.TransactionClient = this.#tx) {
    const creationPromises = [];
    for (let i = 0; i < count; i++) {
      creationPromises.push(this.createUser(tx));
    }
    await Promise.all(creationPromises);
  }

  async teardown(tx: Prisma.TransactionClient = this.#tx) {
    await tx.user.deleteMany({ where: { id: { in: this.users.map((u) => u.id) } } });
  }
}
