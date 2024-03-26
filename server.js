import express from 'express';
import bodyParser from 'body-parser';
import { dbConnection, healthCheck } from './controllers/healthController.js';
import { handlePayloadChecks } from './controllers/payload.js';
import sequelize from './config/dbConfig.js';
import router from './routes/userRoutes.js';
import logger from './logger.js';
import { verifyUser } from './controllers/userController.js';

const app = express();

// Middleware to log incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Middleware to handle invalid URLs
app.use('/healthz/*', (req, res) => {
  logger.warn(`Invalid URL requested: ${req.url}`);
  res
    .status(404)
    .header("Cache-Control", "no-cache, no-store, must-revalidate")
    .header("Pragma", "no-cache")
    .header("X-Content-Type-Options", "nosniff")
    .send();
});

// Middleware to log errors
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  next(err);
});

// Middleware to handle invalid methods
app.use('/healthz', (req, res, next) => {
  if (req.method !== 'GET') {
    logger.warn(`Invalid method requested: ${req.method}`);
    res
      .status(405)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("X-Content-Type-Options", "nosniff")
      .send();
  } else {
    next();
  }
});

app.get('/verify', verifyUser) ;

// Middleware to handle invalid query parameters
app.use('/', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    logger.warn(`Invalid query parameters: ${JSON.stringify(req.query)}`);
    res
      .status(400)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("X-Content-Type-Options", "nosniff")
      .send();
  } else {
    next();
  }
});

// Middleware to handle payload presence
app.use('/healthz', handlePayloadChecks);

// Middleware for database connectivity check
app.use('/healthz', dbConnection);

// Endpoint for health check
app.get('/healthz', healthCheck);



// Disable 'x-powered-by' header
app.disable('x-powered-by');

// Middleware to handle invalid methods for non-existent endpoints
app.use('/', (req, res, next) => {
  const allowedPaths = ['/v1/user', '/v1/user/self'];
  if (allowedPaths.includes(req.path)) {
    next();
  } else {
    logger.warn(`Invalid endpoint requested: ${req.method} ${req.path}`);
    res.status(404).send();
  }
});

app.use(bodyParser.json());

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    logger.error('Invalid JSON in request body');
    res.status(400).json({ error: 'Invalid JSON in request body' });
  } else {
    next(error);
  }
});

app.use('/v1/user', router);

// Synchronize the model with the database
sequelize.sync().then(() => {
  const PORT = 8080;
  app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));
});

export default app;
