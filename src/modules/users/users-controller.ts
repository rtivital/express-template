import express from 'express';
import { HttpError } from '@/errors';
import { prisma } from '@/prisma';
import { getUserByEmail } from './get-user-by-email';

export const UsersController = express.Router();

UsersController.get('/api/v1/users', async (_req, _res) => {
  await prisma.user.findMany();
  throw new HttpError(404, 'Not Found', { reason: 'Just a test error' });
});

UsersController.get('/api/v1/users/email', (req, res) => {
  const user = getUserByEmail({ email: req.query.email as string });
  res.json(user);
});
