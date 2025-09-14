import { env } from 'process';
import { PrismaClient } from 'generated/prisma';
import { logger } from './logger';

export const prisma = new PrismaClient();

export async function connectPrisma() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info(`Database connected: ${env.DATABASE_URL}`);
  } catch (error) {
    logger.error(error, 'Prisma connection error');
    process.exit(1);
  }
}
