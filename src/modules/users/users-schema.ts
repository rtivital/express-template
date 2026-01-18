import z from 'zod';
import { registry } from '@/openapi/registry';

// Base user schema for creating/updating users
export const BaseUserSchema = z
  .object({
    email: z.email({ error: 'Invalid email address' }).openapi({
      description: 'User email address',
      example: 'user@example.com',
    }),
    name: z
      .string({ error: 'Name must be a string' })
      .min(2, { error: 'Must be at least 2 characters' })
      .max(100, { error: 'Must be at most 100 characters' })
      .openapi({
        description: 'User full name',
        example: 'John Doe',
      }),
  })
  .openapi('CreateUser');

// User response schema (includes ID)
export const UserResponseSchema = z
  .object({
    id: z.number().int().openapi({
      description: 'User ID',
      example: 1,
    }),
    email: z.string().email().openapi({
      description: 'User email address',
      example: 'user@example.com',
    }),
    name: z.string().openapi({
      description: 'User full name',
      example: 'John Doe',
    }),
  })
  .openapi('User');

// Paginated users response schema
export const PaginatedUsersSchema = z
  .object({
    data: z.array(UserResponseSchema).openapi({
      description: 'Array of users',
    }),
    total: z.number().int().openapi({
      description: 'Total number of users',
      example: 100,
    }),
    page: z.number().int().openapi({
      description: 'Current page number',
      example: 1,
    }),
    pageSize: z.number().int().openapi({
      description: 'Number of items per page',
      example: 10,
    }),
    totalPages: z.number().int().openapi({
      description: 'Total number of pages',
      example: 10,
    }),
  })
  .openapi('PaginatedUsers');

// Login request schema
export const LoginSchema = z
  .object({
    email: z.string().email().openapi({
      description: 'User email address',
      example: 'user@example.com',
    }),
  })
  .openapi('LoginRequest');

// Logout response schema
export const LogoutResponseSchema = z
  .object({
    message: z.string().openapi({
      description: 'Logout confirmation message',
      example: 'Logged out',
    }),
  })
  .openapi('LogoutResponse');

// Register schemas with the global registry
registry.register('User', UserResponseSchema);
registry.register('CreateUser', BaseUserSchema);
registry.register('PaginatedUsers', PaginatedUsersSchema);
registry.register('LoginRequest', LoginSchema);
registry.register('LogoutResponse', LogoutResponseSchema);
