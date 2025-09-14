import express from 'express';
import { sessionMiddleware } from '@/middlewares/session';
import { prisma } from './prisma';

export const app = express();

app.use(sessionMiddleware);

app.get('/health', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ message: 'ok', users });
});
