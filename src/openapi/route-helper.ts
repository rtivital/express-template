import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { ZodType } from 'zod';
import { registry } from './registry';

interface RegisterRouteOptions {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  summary: string;
  description?: string;
  tags: string[];
  requiresAuth?: boolean;
  request?: {
    params?: ZodType<any, any, any>;
    query?: ZodType<any, any, any>;
    body?: ZodType<any, any, any>;
  };
  responses: {
    [statusCode: number]: {
      description: string;
      schema?: ZodType<any, any, any>;
    };
  };
}

export function registerRoute(options: RegisterRouteOptions) {
  const {
    method,
    path,
    summary,
    description,
    tags,
    requiresAuth = false,
    request,
    responses,
  } = options;

  const routeConfig: RouteConfig = {
    method,
    path,
    summary,
    description,
    tags,
    request: {},
    responses: {},
  };

  // Add authentication if required
  if (requiresAuth) {
    routeConfig.security = [{ sessionAuth: [] }];
  }

  // Add request schemas
  if (request?.params) {
    routeConfig.request!.params = request.params as any;
  }

  if (request?.query) {
    routeConfig.request!.query = request.query as any;
  }

  if (request?.body) {
    routeConfig.request!.body = {
      content: {
        'application/json': {
          schema: request.body,
        },
      },
    };
  }

  // Add response schemas
  for (const [statusCode, responseConfig] of Object.entries(responses)) {
    if (responseConfig.schema) {
      routeConfig.responses![statusCode] = {
        description: responseConfig.description,
        content: {
          'application/json': {
            schema: responseConfig.schema,
          },
        },
      };
    } else {
      routeConfig.responses![statusCode] = {
        description: responseConfig.description,
      };
    }
  }

  registry.registerPath(routeConfig);
}
