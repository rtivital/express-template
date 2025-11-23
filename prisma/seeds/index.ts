import { prisma } from '@/prisma';

const users = [
  { email: 'alice@example.com', name: 'Seeded Alice' },
  { email: 'bob@example.com', name: 'Seeded Bob' },
  { email: 'carol@example.com', name: 'Seeded Carol' },
];

for (const user of users) {
  await prisma.user.upsert({
    where: { email: user.email },
    update: {}, // nothing to update if already exists
    create: user,
  });
}
