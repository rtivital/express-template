import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from '@/env';
import { sessionMiddleware } from '@/middlewares/session';
import { prisma } from '@/prisma';
import { trailingSlashRedirect } from './middlewares/trailing-slash-redirect';

export const app = express();

app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(trailingSlashRedirect);

if (env.CORS) {
  app.use(cors({ origin: env.CORS.split(','), credentials: true }));
}

app.use(sessionMiddleware);

app.get('/health', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ message: 'ok', users });
});
