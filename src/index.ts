import { app } from './app';
import { env } from './env';
import { logger } from './logger';

const start = async () => {
  try {
    app.listen(env.PORT, () => {
      logger.info(`Server listening at http://localhost:${env.PORT}`);
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
