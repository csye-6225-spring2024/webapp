import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: '/var/log/webapp/myapp.log' })
  ]
});

// Log messages
logger.info('This is an information message');
logger.error('This is an error message');
logger.warn('This is a warning message');

export default logger;

