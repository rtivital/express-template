import z from 'zod';
import { registerRoute } from './route-helper';

// Health check response schema
const HealthResponseSchema = z
  .object({
    status: z.string().openapi({
      description: 'Health status',
      example: 'ok',
    }),
  })
  .openapi('HealthResponse');

export function registerHealthRoutes() {
  registerRoute({
    method: 'get',
    path: '/health',
    summary: 'Health check',
    description: 'Check if the server is running and database is connected',
    tags: ['Health'],
    requiresAuth: false,
    responses: {
      200: {
        description: 'Server is healthy',
        schema: HealthResponseSchema,
      },
    },
  });
}
