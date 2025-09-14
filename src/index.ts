import { app } from './app';
import { env } from './env';
import { logger } from './logger';
import { connectPrisma, prisma } from './prisma';
import { connectRedis, redisClient } from './redis';

const start = async () => {
  try {
    await Promise.all([connectPrisma(), connectRedis()]);

    app.listen(env.PORT, () => {
      logger.info(`Server listening: http://localhost:${env.PORT}`);
    });
  } catch (error) {
    redisClient.destroy();
    await prisma.$disconnect();
    logger.fatal(error, 'Server failed to start');
    throw error;
  }
};

start();
