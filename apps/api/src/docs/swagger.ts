import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../config/env';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FH6 Cars Public REST API',
      version: '1.0.0',
      description:
        'Structured Forza Horizon 6 Car Database REST API exposing car performance statistics, manufacturers, engine specs, search, filtering, and admin data management.',
      contact: {
        name: 'FH6 Cars Developer Team',
        url: 'https://github.com/fh6cars/fh6-cars',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Local Development Server',
      },
      {
        url: 'https://api.fh6cars.example/api/v1',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/cars': {
        get: {
          summary: 'Get paginated list of Forza Horizon 6 cars with optional filters',
          tags: ['Public Cars'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'brand', in: 'query', schema: { type: 'string' } },
            { name: 'class', in: 'query', schema: { type: 'string' } },
            { name: 'year', in: 'query', schema: { type: 'integer' } },
            { name: 'drivetrain', in: 'query', schema: { type: 'string' } },
            { name: 'minPi', in: 'query', schema: { type: 'integer' } },
            { name: 'maxPi', in: 'query', schema: { type: 'integer' } },
            { name: 'isDlc', in: 'query', schema: { type: 'boolean' } },
            { name: 'sort', in: 'query', schema: { type: 'string', default: 'fullName' } },
            { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } },
          ],
          responses: {
            '200': { description: 'Paginated list of cars' },
          },
        },
      },
      '/cars/{id}': {
        get: {
          summary: 'Get full details for a single car by ID',
          tags: ['Public Cars'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            '200': { description: 'Car details' },
            '404': { description: 'Car not found' },
          },
        },
      },
      '/cars/search': {
        get: {
          summary: 'Search cars by query string',
          tags: ['Public Cars'],
          parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }],
          responses: {
            '200': { description: 'Search results' },
          },
        },
      },
      '/brands': {
        get: {
          summary: 'Get all car brands/manufacturers',
          tags: ['Lookups'],
          responses: {
            '200': { description: 'List of brands' },
          },
        },
      },
      '/brands/{slug}': {
        get: {
          summary: 'Get brand details and its cars by slug',
          tags: ['Lookups'],
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': { description: 'Brand details' },
          },
        },
      },
      '/statistics': {
        get: {
          summary: 'Get overall database statistics',
          tags: ['Lookups'],
          responses: {
            '200': { description: 'Overview statistics' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Admin user login',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'admin@example.com' },
                    password: { type: 'string', example: 'password' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'JWT authentication response' },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
    },
  },
  apis: [],
});
