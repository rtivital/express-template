import express from 'express';
import { HttpError } from '@/errors';
import { prisma } from '@/prisma';

export const UsersController = express.Router();

UsersController.get('/api/v1/users', async (_req, _res) => {
  await prisma.user.findMany();
  throw new HttpError(404, 'Not Found', { reason: 'Just a test error' });
});
