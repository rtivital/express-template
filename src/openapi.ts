import { registerUserRoutes } from './modules/users/users-routes';
import { generateOpenApiDocument } from './openapi/generator';
import { registerHealthRoutes } from './openapi/health-routes';

// Register all routes
registerHealthRoutes();
registerUserRoutes();

// Generate and export the OpenAPI specification
export const openApiSpec = generateOpenApiDocument();
