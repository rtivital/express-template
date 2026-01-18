import { createClient } from 'redis';
import { env } from '@/env';
import { logger } from '@/logger';

export const redisClient = createClient({ url: env.REDIS_URL }).on('error', (err) =>
  logger.error(err, 'Redis Client Error')
);

export async function connectRedis() {
  try {
    await redisClient.connect();
    await redisClient.ping();
    const sanitizedUrl = env.REDIS_URL.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
    logger.info(`Redis connected: ${sanitizedUrl}`);
  } catch (error) {
    logger.fatal(error, 'Redis connection error');
    throw error;
  }
}
