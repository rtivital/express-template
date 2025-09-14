import { app } from './app.js';
import { env } from './env.js';
import { logger } from './logger.js';

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
