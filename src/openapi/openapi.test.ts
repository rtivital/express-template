import { openApiSpec } from '../openapi';

describe('OpenAPI Specification', () => {
  it('should have correct OpenAPI version and basic structure', () => {
    expect(openApiSpec.openapi).toBe('3.0.0');
    expect(openApiSpec.info).toBeDefined();
    expect(openApiSpec.info.title).toBe('Express Template API');
    expect(openApiSpec.info.version).toBe('1.0.0');
  });

  it('should have all required endpoints documented', () => {
    const paths = Object.keys(openApiSpec.paths);

    expect(paths).toContain('/health');
    expect(paths).toContain('/api/v1/users');
    expect(paths).toContain('/api/v1/users/{id}');
    expect(paths).toContain('/api/v1/users/me');
    expect(paths).toContain('/api/v1/users/login');
    expect(paths).toContain('/api/v1/users/logout');
  });

  it('should have correct HTTP methods for each endpoint', () => {
    expect(openApiSpec.paths['/health'].get).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users'].get).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users'].post).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/{id}'].get).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/{id}'].put).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/{id}'].delete).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/me'].get).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/login'].post).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/logout'].post).toBeDefined();
  });

  it('should have security schemes defined', () => {
    expect(openApiSpec.components?.securitySchemes).toBeDefined();
    const sessionAuth = openApiSpec.components?.securitySchemes?.sessionAuth;
    expect(sessionAuth).toBeDefined();
    if (sessionAuth && 'type' in sessionAuth) {
      expect(sessionAuth.type).toBe('apiKey');
      expect(sessionAuth.in).toBe('cookie');
    }
  });

  it('should have User schema component', () => {
    expect(openApiSpec.components?.schemas).toBeDefined();
    expect(openApiSpec.components?.schemas?.User).toBeDefined();
  });

  it('should have CreateUser schema component', () => {
    expect(openApiSpec.components?.schemas?.CreateUser).toBeDefined();
  });

  it('should have PaginatedUsers schema component', () => {
    expect(openApiSpec.components?.schemas?.PaginatedUsers).toBeDefined();
  });

  it('should have error schemas defined', () => {
    expect(openApiSpec.components?.schemas).toBeDefined();
    expect(openApiSpec.components?.schemas?.UnauthorizedError).toBeDefined();
    expect(openApiSpec.components?.schemas?.NotFoundError).toBeDefined();
    expect(openApiSpec.components?.schemas?.ValidationError).toBeDefined();
  });

  it('should mark authenticated endpoints with security', () => {
    // These endpoints should require authentication
    expect(openApiSpec.paths['/api/v1/users']?.get?.security).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users']?.get?.security).toContainEqual({
      sessionAuth: [],
    });

    expect(openApiSpec.paths['/api/v1/users/{id}']?.get?.security).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/{id}']?.put?.security).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/{id}']?.delete?.security).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/me']?.get?.security).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/logout']?.post?.security).toBeDefined();
  });

  it('should not mark public endpoints with security', () => {
    // These endpoints should NOT require authentication
    expect(openApiSpec.paths['/health']?.get?.security).toBeUndefined();
    expect(openApiSpec.paths['/api/v1/users']?.post?.security).toBeUndefined();
    expect(openApiSpec.paths['/api/v1/users/login']?.post?.security).toBeUndefined();
  });

  it('should have proper tags for organization', () => {
    expect(openApiSpec.paths['/health']?.get?.tags).toContain('Health');
    expect(openApiSpec.paths['/api/v1/users']?.get?.tags).toContain('Users');
    expect(openApiSpec.paths['/api/v1/users/login']?.post?.tags).toContain('Authentication');
    expect(openApiSpec.paths['/api/v1/users/logout']?.post?.tags).toContain('Authentication');
  });

  it('should have request bodies for POST/PUT endpoints', () => {
    expect(openApiSpec.paths['/api/v1/users']?.post?.requestBody).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/{id}']?.put?.requestBody).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/login']?.post?.requestBody).toBeDefined();
  });

  it('should have response schemas for successful responses', () => {
    expect(openApiSpec.paths['/health']?.get?.responses?.['200']).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users']?.get?.responses?.['200']).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users']?.post?.responses?.['201']).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/{id}']?.get?.responses?.['200']).toBeDefined();
  });

  it('should have path parameters for endpoints with {id}', () => {
    expect(openApiSpec.paths['/api/v1/users/{id}']?.get?.parameters).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/{id}']?.put?.parameters).toBeDefined();
    expect(openApiSpec.paths['/api/v1/users/{id}']?.delete?.parameters).toBeDefined();
  });

  it('should have query parameters for paginated endpoints', () => {
    expect(openApiSpec.paths['/api/v1/users']?.get?.parameters).toBeDefined();
  });
});
