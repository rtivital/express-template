import express from 'express';
import { prisma } from './prisma';

export const app = express();

app.get('/health', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json({ message: 'ok', users });
});
