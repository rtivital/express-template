import { env } from '@/env';
import { logger } from '@/logger';
import { PrismaClient } from './generated/prisma/client';

export const prisma = new PrismaClient();

export async function connectPrisma() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info(`Database connected: ${env.DATABASE_URL}`);
  } catch (error) {
    logger.fatal(error, 'Prisma connection error');
    throw error;
  }
}
