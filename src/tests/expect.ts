import { ZodError } from 'zod';
import { formatZodError } from '@/utils/format-zod-error';

export function expectValidationError(input: any, path: string, message?: string) {
  const formatted = input instanceof ZodError ? formatZodError(input) : input;

  expect(formatted).toHaveProperty('message', 'Validation Error');
  expect(formatted).toHaveProperty('details');

  const details = formatted.details as { path: string; message: string }[];
  const issue = details.find((d) => d.path === path);
  expect(issue).toBeDefined();

  if (message) {
    expect(issue).toHaveProperty('message', message);
  }
}
