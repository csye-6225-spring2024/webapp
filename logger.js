// import winston from 'winston';

// // Create a logger instance
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: '/var/log/webapp/myapp.log' })
//   ]
// });

// // Log messages
// logger.info('This is an information message');
// logger.error('This is an error message');
// logger.warn('This is a warning message');


import winston from 'winston';
import dotenv from "dotenv";
dotenv.config();

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.printf(info => {
      return `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: process.env.LOGPATH ?? './log/app.log' })
  ]
});

export default logger;



