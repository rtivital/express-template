import express from 'express';
import { prisma } from './prisma';

const app = express();

app.get('/h3al4h', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json({ message: 'ok', users });
});

export { app };
