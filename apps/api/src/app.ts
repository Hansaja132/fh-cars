import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/error-handler';
import { publicRateLimiter } from './middleware/rate-limiter';
import { swaggerSpec } from './docs/swagger';
import v1Router from './routes/v1';

const app = express();

// Security & CORS
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(pinoHttp({ logger }));
}

// Request Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.text({ type: ['text/csv', 'text/plain'], limit: '10mb' }));

// Swagger UI Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'FH6 Cars API Docs' }));

// Rate Limiting on public API
app.use('/api/v1', publicRateLimiter);

// Versioned Routes
app.use('/api/v1', v1Router);

// Healthcheck Route
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
