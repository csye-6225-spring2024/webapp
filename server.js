import express from 'express';
import bodyParser from 'body-parser';
import { dbConnection, healthCheck } from './controllers/healthController.js';
import { handlePayloadChecks } from './controllers/payload.js';
import sequelize from './config/dbConfig.js';
import router from './routes/userRoutes.js';
// import logger from './logger.js';


const app = express();
 
// Middleware to handle invalid URLs
app.use('/healthz/*', (req, res) => {
  res
  .status(404)
  .header("Cache-Control", "no-cache, no-store, must-revalidate")
  .header("Pragma", "no-cache")
  .header("X-Content-Type-Options", "nosniff")
  .send();
});

// Middleware to check for invalid query parameters
app.use('/', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
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

// Middleware to check for invalid methods
app.use('/healthz', (req, res, next) => {
  if (req.method !== 'GET') {
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

// Middleware to check for payload presence
app.use('/healthz', handlePayloadChecks);

// Middleware to handle invalid payloads for GET requests
app.use('/healthz', (req, res, next) => {
  if (req.method === 'GET') {
    bodyParser.json()(req, res, (error) => {
      if (error) {
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
  } else {
    next();
  }
});

// Disable 'x-powered-by' header
app.disable('x-powered-by');

// Middleware for database connectivity check
app.use('/healthz', dbConnection);

// Endpoint for health check
app.get('/healthz', healthCheck);

//app.use(bodyParser.json());
  
// Middleware to handle invalid methods for non-existent endpoints
app.use('/', (req, res, next) => {
    const allowedPaths = ['/v1/user', '/v1/user/self'];
    if (allowedPaths.includes(req.path)) {
        next();
    } else {
        res.status(404).send();
    }
});

app.use(bodyParser.json()); 

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      res.status(400).json({ error: 'Invalid JSON in request body' });
  } else {
      next(error);
  }
});

app.use('/v1/user', router); 

// Synchronize the model with the database
sequelize.sync().then(() => {
  const PORT = 8080;
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});

export default app;