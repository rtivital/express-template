import { app } from './app';
import { env } from './env';
import { logger } from './logger';
import { connectPrisma, prisma } from './prisma';

const start = async () => {
  try {
    await connectPrisma();

    app.listen(env.PORT, () => {
      logger.info(`Server listening: http://localhost:${env.PORT}`);
    });
  } catch (err) {
    await prisma.$disconnect();
    logger.error(err);
    process.exit(1);
  }
};

start();
