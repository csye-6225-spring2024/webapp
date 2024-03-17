import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: '/var/log/webapp.log' })
  ]
});

// Log messages
logger.info('This is an information message');
logger.error('This is an error message');
logger.warn('This is a warning message');


// const { createLogger, format, transports } = require('winston');
// const { LoggingWinston } = require('@google-cloud/logging-winston');

// // Create a Winston logger instance
// const logger = createLogger({
//   format: format.combine(
//     format.timestamp(),
//     format.json() 
//   ),
//   transports: [
//     new transports.Console(), 
//     new LoggingWinston({ 
//       projectId: 'YOUR_PROJECT_ID',
//     }),
//   ],
// });

// // Example usage
// logger.info('Application started', { version: '1.0.0', environment: 'production' });
// logger.error('An error occurred', { error: 'Some error message', code: 500 });


// ----------------------------

// const winston = require('winston');
// const path = require('path');

// const logDirectory = process.env.NODE_ENV === 'test' ? '.' : '/var/log/webapp/';

// // Define the custom Winston logger
// const logger = winston.createLogger({
//   // Set up the logger format
//   format: winston.format.combine(
//     winston.format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss'
//     }),
//     winston.format.printf(info => ${info.timestamp} ${info.level}: ${info.message})
//   ),
//   // Define the transports (where to log the messages to)
//   transports: [
//     // Define a file transport for all logs
//     new winston.transports.File({
//       filename: path.join(logDirectory, 'csye6225.log'),
//       level: 'debug',
//     }),
//   ],
//   exitOnError: false,
// });

// logger.stream = {
//     write: function (message) {
//       // Use the 'info' log level so the output will be picked up by both transports (console and file)
//       logger.info(message.trim());
//     },
// };

// // Export the logger so it can be used in other files
export default logger;

