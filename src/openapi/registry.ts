import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import z from 'zod';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

// Create global registry
export const registry = new OpenAPIRegistry();

// Register security schemes
registry.registerComponent('securitySchemes', 'sessionAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'connect.sid',
  description: 'Session-based authentication using cookies',
});

// Register common error response schemas
export const UnauthorizedSchema = z
  .object({
    message: z.string().openapi({ example: 'Unauthorized' }),
  })
  .openapi('UnauthorizedError');

export const NotFoundSchema = z
  .object({
    message: z.string().openapi({ example: 'Resource not found' }),
  })
  .openapi('NotFoundError');

export const ValidationErrorSchema = z
  .object({
    message: z.string().openapi({ example: 'Validation Error' }),
    errors: z
      .array(
        z.object({
          field: z.string().openapi({ example: 'email' }),
          message: z.string().openapi({ example: 'Invalid email' }),
        })
      )
      .optional(),
  })
  .openapi('ValidationError');

// Register error schemas for reuse
registry.register('UnauthorizedError', UnauthorizedSchema);
registry.register('NotFoundError', NotFoundSchema);
registry.register('ValidationError', ValidationErrorSchema);
