import { pino } from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : env.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname,reqId',
    },
  },
});
