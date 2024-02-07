import express from 'express';
import bodyParser from 'body-parser';
import { dbConnection, healthCheck } from './controllers/healthController.js';
import { handlePayloadChecks } from './controllers/payload.js';
import sequelize from './config/dbConfig.js';
import router from './routes/userRoutes.js';

const app = express();

 
// Middleware to handle invalid URLs
app.use('/healthz/*', (req, res) => {
  res.status(404).send();
});

// Middleware to check for invalid query parameters
app.use('/', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    res.status(400).send();
  } else {
    next();
  }
});

// Middleware to check for invalid methods
app.use('/healthz', (req, res, next) => {
  if (req.method !== 'GET') {
    res.status(405).send();
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
        res.status(400).send();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

// app.use('/', (req, res, next) => {
//     const disallowedMethods = ['HEAD', 'OPTIONS'];
//     if (disallowedMethods.includes(req.method)) {
//       res.status(405).send();
//     } else {
//       next();
//     }
//   });

// Disable 'x-powered-by' header
app.disable('x-powered-by');

// Middleware for database connectivity check
app.use('/healthz', dbConnection);

// Endpoint for health check
app.get('/healthz', healthCheck);

//app.use(bodyParser.json());
  

// Middleware to handle invalid methods for non-existent endpoints
app.use('/', (req, res, next) => {
    // Check if the requested path is /v1/user or /v1/user/self
    const allowedPaths = ['/v1/user', '/v1/user/self'];
    if (allowedPaths.includes(req.path)) {
        // If the requested path is allowed, pass control to the next middleware
        next();
    } else {
        // If the requested path is not allowed, send a 404 error response
        res.status(404).send();
    }
});

app.use(bodyParser.json());
app.use('/v1/user', router); 

// Synchronize the model with the database
sequelize
  .query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`)
  .then(() => sequelize.query(`USE ${process.env.DATABASE}`))
  .then(() => sequelize.sync({ alter: true })) // Update existing tables
  .then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });


export default app; 