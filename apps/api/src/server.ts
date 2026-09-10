import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`🏎️  FH6 Cars API Server running at http://localhost:${env.PORT}`);
  logger.info(`📚 Swagger UI documentation available at http://localhost:${env.PORT}/api/docs`);
});

process.on('unhandledRejection', (err) => {
  logger.error(err, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught Exception');
  process.exit(1);
});

export default server;
