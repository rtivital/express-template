import { Server } from 'node:http';
import { app } from '@/app';
import { env } from '@/env';
import { logger } from '@/logger';
import { connectPrisma, prisma } from '@/prisma';
import { connectRedis, redisClient } from '@/redis';

let server: Server;

const start = async () => {
  try {
    await Promise.all([connectPrisma(), connectRedis()]);

    server = app.listen(env.PORT, () => {
      logger.info(`Server listening: http://localhost:${env.PORT}`);
    });
  } catch (error) {
    redisClient.destroy();
    await prisma.$disconnect();
    logger.fatal(error, 'Server failed to start');
    throw error;
  }
};

const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);

  if (server) {
    server.close(async (err) => {
      if (err) {
        logger.error(err, 'Error during server shutdown');
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
      }

      logger.info('HTTP server closed');

      try {
        await prisma.$disconnect();
        logger.info('Database connection closed');

        if (redisClient.isOpen) {
          await redisClient.quit();
          logger.info('Redis connection closed');
        }

        logger.info('Graceful shutdown completed');
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0);
      } catch (error) {
        logger.error(error, 'Error during cleanup');
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.warn('Forcing shutdown after timeout');
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }, 30_000);
  } else {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
