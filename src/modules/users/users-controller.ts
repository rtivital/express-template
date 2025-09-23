import express from 'express';
import status from 'http-status';
import { HttpError } from '@/errors';
import { sessionGuard } from '@/middlewares/session-guard';
import { validate } from '@/middlewares/validate';
import { prisma } from '@/prisma';
import { IdObjectSchema, PaginationParamsSchema } from '@/validation';
import { deleteUser } from './delete-user';
import { getUserByEmail, GetUserByEmailSchema } from './get-user-by-email';
import { getUserById } from './get-user-by-id';
import { getUsers } from './get-users';
import { updateUser } from './update-user';
import { BaseUserSchema } from './users-schema';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

export const UsersController = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get paginated list of users
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         description: Unauthorized - session required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UsersController.get(
  '/api/v1/users',
  validate(PaginationParamsSchema, 'query'),
  sessionGuard,
  async (req, res) => {
    const users = await getUsers(req.query);
    res.json(users);
  }
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - session required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UsersController.get(
  '/api/v1/users/:id',
  validate(IdObjectSchema, 'params'),
  sessionGuard,
  async (req, res) => {
    const user = await getUserById({ id: req.params.id });

    if (!user) {
      throw new HttpError(status.NOT_FOUND, 'User not found');
    }

    res.json(user);
  }
);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - session required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UsersController.get('/api/v1/users/me', sessionGuard, async (req, res) => {
  if (!req.session.userId) {
    throw new HttpError(status.UNAUTHORIZED, 'Unauthorized');
  }

  const user = await getUserById({ id: req.session.userId });

  if (!req.session.userId) {
    throw new HttpError(status.UNAUTHORIZED, 'Unauthorized');
  }

  res.json(user);
});

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UsersController.post('/api/v1/users/login', validate(GetUserByEmailSchema), async (req, res) => {
  const user = await getUserByEmail({ email: req.body.email });

  if (!user) {
    res.status(status.NOT_FOUND).json({ message: 'User not found' });
    return;
  }

  req.session.userId = user.id;
  req.user = user;
  res.json(user);
});

/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out"
 *       401:
 *         description: Unauthorized - session required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UsersController.post('/api/v1/users/logout', sessionGuard, async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Could not log out' });
      return;
    }

    res.json({ message: 'Logged out' });
  });
});

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UsersController.post('/api/v1/users', validate(BaseUserSchema), async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  req.session.userId = user.id;
  req.user = user;
  res.status(status.CREATED).json(user);
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - session required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UsersController.put(
  '/api/v1/users/:id',
  validate(BaseUserSchema, 'body'),
  validate(IdObjectSchema, 'params'),
  sessionGuard,
  async (req, res) => {
    const user = await updateUser({ id: req.params.id, ...req.body });

    if (!user) {
      throw new HttpError(status.NOT_FOUND, 'User not found');
    }

    res.json(user);
  }
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - session required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
UsersController.delete(
  '/api/v1/users/:id',
  validate(IdObjectSchema, 'params'),
  sessionGuard,
  async (req, res) => {
    const user = await deleteUser({ id: req.params.id });
    res.json(user);
  }
);
