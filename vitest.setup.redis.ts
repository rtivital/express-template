import { prisma } from './src/prisma';
import { connectRedis, redisClient } from './src/redis';

beforeAll(async () => {
  await connectRedis();
});

afterAll(async () => {
  if (redisClient.isOpen) {
    await redisClient.flushAll();
    await redisClient.quit();
  }
  await prisma.$disconnect();
});

afterEach(async () => {
  if (redisClient.isOpen) {
    await redisClient.flushAll();
  }
});
