import { ZodError } from 'zod';

export function formatZodError(error: ZodError) {
  return {
    message: 'Validation Error',
    details: error.issues.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    })),
  };
}
