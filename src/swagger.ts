import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Template API',
      version: '1.0.0',
      description: 'A REST API built with Express, TypeScript, and Prisma',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Session-based authentication using cookies',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'User full name',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        UserInput: {
          type: 'object',
          required: ['email', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'User full name',
            },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address for login',
            },
          },
        },
        PaginationResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Current page number',
                },
                limit: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 100,
                  description: 'Number of items per page',
                },
                total: {
                  type: 'integer',
                  minimum: 0,
                  description: 'Total number of items',
                },
                totalPages: {
                  type: 'integer',
                  minimum: 0,
                  description: 'Total number of pages',
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts', './src/swagger.ts'], // paths to files containing OpenAPI definitions
};

export const specs = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Express Template API Documentation',
    })
  );
}
