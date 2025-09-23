import { pino } from 'pino';
import PinoHttp from 'pino-http';
import { env } from '@/env';

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

export const httpLogger = PinoHttp({
  logger,
  serializers: {
    req(req) {
      return { method: req.method, url: req.url };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
});
