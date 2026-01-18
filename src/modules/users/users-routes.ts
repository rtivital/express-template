import z from 'zod';
import { registerRoute } from '@/openapi/route-helper';
import { IdObjectSchema, PaginationParamsSchema } from '@/validation';
import {
  BaseUserSchema,
  LoginSchema,
  LogoutResponseSchema,
  PaginatedUsersSchema,
  UserResponseSchema,
} from './users-schema';

// Not found response for user operations
const UserNotFoundSchema = z
  .object({
    message: z.string().openapi({
      description: 'Error message',
      example: 'User not found',
    }),
  })
  .openapi('UserNotFoundResponse');

export function registerUserRoutes() {
  // GET /api/v1/users - List users (authenticated, paginated)
  registerRoute({
    method: 'get',
    path: '/api/v1/users',
    summary: 'List users',
    description: 'Get a paginated list of users (requires authentication)',
    tags: ['Users'],
    requiresAuth: true,
    request: {
      query: PaginationParamsSchema,
    },
    responses: {
      200: {
        description: 'Successful response',
        schema: PaginatedUsersSchema,
      },
      401: {
        description: 'Unauthorized',
      },
      422: {
        description: 'Validation error',
      },
    },
  });

  // POST /api/v1/users - Create user
  registerRoute({
    method: 'post',
    path: '/api/v1/users',
    summary: 'Create user',
    description: 'Create a new user account',
    tags: ['Users'],
    requiresAuth: false,
    request: {
      body: BaseUserSchema,
    },
    responses: {
      201: {
        description: 'User created successfully',
        schema: UserResponseSchema,
      },
      422: {
        description: 'Validation error',
      },
    },
  });

  // GET /api/v1/users/{id} - Get user by ID (authenticated)
  registerRoute({
    method: 'get',
    path: '/api/v1/users/{id}',
    summary: 'Get user by ID',
    description: 'Get a specific user by their ID (requires authentication)',
    tags: ['Users'],
    requiresAuth: true,
    request: {
      params: IdObjectSchema,
    },
    responses: {
      200: {
        description: 'Successful response',
        schema: UserResponseSchema,
      },
      401: {
        description: 'Unauthorized',
      },
      404: {
        description: 'User not found',
      },
    },
  });

  // PUT /api/v1/users/{id} - Update user (authenticated)
  registerRoute({
    method: 'put',
    path: '/api/v1/users/{id}',
    summary: 'Update user',
    description: 'Update user information (requires authentication)',
    tags: ['Users'],
    requiresAuth: true,
    request: {
      params: IdObjectSchema,
      body: BaseUserSchema,
    },
    responses: {
      200: {
        description: 'User updated successfully',
        schema: UserResponseSchema,
      },
      401: {
        description: 'Unauthorized',
      },
      404: {
        description: 'User not found',
      },
      422: {
        description: 'Validation error',
      },
    },
  });

  // DELETE /api/v1/users/{id} - Delete user (authenticated)
  registerRoute({
    method: 'delete',
    path: '/api/v1/users/{id}',
    summary: 'Delete user',
    description: 'Delete a user account (requires authentication)',
    tags: ['Users'],
    requiresAuth: true,
    request: {
      params: IdObjectSchema,
    },
    responses: {
      200: {
        description: 'User deleted successfully',
        schema: UserResponseSchema,
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });

  // GET /api/v1/users/me - Get current user (authenticated)
  registerRoute({
    method: 'get',
    path: '/api/v1/users/me',
    summary: 'Get current user',
    description: 'Get the currently authenticated user (requires authentication)',
    tags: ['Users'],
    requiresAuth: true,
    responses: {
      200: {
        description: 'Successful response',
        schema: UserResponseSchema,
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });

  // POST /api/v1/users/login - Login
  registerRoute({
    method: 'post',
    path: '/api/v1/users/login',
    summary: 'Login',
    description: 'Login with email (simplified auth for template)',
    tags: ['Authentication'],
    requiresAuth: false,
    request: {
      body: LoginSchema,
    },
    responses: {
      200: {
        description: 'Login successful',
        schema: UserResponseSchema,
      },
      404: {
        description: 'User not found',
        schema: UserNotFoundSchema,
      },
      422: {
        description: 'Validation error',
      },
    },
  });

  // POST /api/v1/users/logout - Logout (authenticated)
  registerRoute({
    method: 'post',
    path: '/api/v1/users/logout',
    summary: 'Logout',
    description: 'Logout the current user (requires authentication)',
    tags: ['Authentication'],
    requiresAuth: true,
    responses: {
      200: {
        description: 'Logout successful',
        schema: LogoutResponseSchema,
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
}
