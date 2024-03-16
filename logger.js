// const winston = require('winston');

// // Create a logger instance
// const logger = winston.createLogger({
//   level: 'info', // Set the logging level
//   format: winston.format.json(), // Use JSON format for logs
//   transports: [
//     new winston.transports.Console(), // Log to console
//     new winston.transports.File({ filename: 'logfile.log' }) // Log to a file
//   ]
// });

// // Log messages
// logger.info('This is an information message');
// logger.error('This is an error message');
// logger.warn('This is a warning message');


const { createLogger, format, transports } = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');

// Create a Winston logger instance
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json() 
  ),
  transports: [
    new transports.Console(), 
    new LoggingWinston({ 
      projectId: 'YOUR_PROJECT_ID',
    }),
  ],
});

// Example usage
logger.info('Application started', { version: '1.0.0', environment: 'production' });
logger.error('An error occurred', { error: 'Some error message', code: 500 });

