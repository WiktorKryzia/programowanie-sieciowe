import app from './app';
import env from './config/env';
import logger from './config/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`Server (${env.NODE_ENV}) running on http://localhost:${env.PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  exitHandler();
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  exitHandler();
});
