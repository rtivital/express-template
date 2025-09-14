import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { env } from '@/env';
import { redisClient } from '@/redis';

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:',
});

export const sessionMiddleware = session({
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  secret: env.SESSION_SECRET,
});
