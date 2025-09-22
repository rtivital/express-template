import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { env } from '@/env';
import { redisClient } from '@/redis';

const store: session.Store =
  env.NODE_ENV === 'test'
    ? new session.MemoryStore()
    : new RedisStore({ client: redisClient, prefix: 'session:' });

export const sessionMiddleware = session({
  store,
  resave: false,
  saveUninitialized: false,
  secret: env.SESSION_SECRET,
  cookie: env.NODE_ENV === 'production' ? { secure: true, httpOnly: true, sameSite: 'lax' } : {},
});
