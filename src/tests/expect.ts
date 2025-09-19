export function expectValidationError(body: any, path: string, message?: string) {
  expect(body).toHaveProperty('message', 'Validation Error');
  expect(body).toHaveProperty('details');

  const details = body.details as { path: string; message: string }[];
  const error = details.find((d) => d.path === path);
  expect(error).toBeDefined();

  if (message) {
    expect(error).toHaveProperty('message', message);
  }
}
