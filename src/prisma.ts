import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '@/env';
import { PrismaClient } from '@/generated/prisma/client';
import { logger } from '@/logger';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

export async function connectPrisma() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const sanitizedUrl = env.DATABASE_URL.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
    logger.info(`Database connected: ${sanitizedUrl}`);
  } catch (error) {
    logger.fatal(error, 'Prisma connection error');
    throw error;
  }
}
