import express from "express";
import bodyParser from "body-parser";
import healthzRoute from "./routes/healthzRoute.js";
import { sequelize } from "./models/healthzModel.js";
import { handlePayload } from "./middlewares/checkPayloadAndQueryParams.js";
import userRoute from "./routes/userRoute.js";
 
const app = express();
const PORT = process.env.PORT || 8080;
app.disable("x-powered-by");
 
app.use("/healthz/*", (req, res) => {
  res
    .status(404)
    .header("Cache-Control", "no-cache, no-store, must-revalidate")
    .header("Pragma", "no-cache")
    .header("X-Content-Type-Options", "nosniff")
    .send();
});
 
// Middleware to check for invalid query parameters
app.use("/", (req, res, next) => {
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
app.use("/healthz", (req, res, next) => {
  if (req.method !== "GET") {
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
 
app.use('/healthz', handlePayload);
 
// Middleware to handle invalid payloads for GET requests
app.use("/healthz", (req, res, next) => {
  if (req.method === "GET") {
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
 
// Route for healthz
app.get("/healthz", healthzRoute);
 
// Middleware to handle invalid methods for non-existent endpoints
app.use((req, res, next) => {
  const allowedPaths = ['/v1/user', '/v1/user/self'];
  const allowedMethods = {
      '/v1/user': ['POST'],
      '/v1/user/self': ['GET', 'PUT']
  };
 
  if (allowedPaths.includes(req.path)) {
      if (!allowedMethods[req.path].includes(req.method)) {
          res.status(405).send();
      } else {
          next();
      }
  } else {
      res.status(404).send();
  }
});
 
app.use(bodyParser.json());
 
app.use("/", userRoute);
 
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      
      res.status(400).json({ error: 'Invalid JSON in request body' });
  } else {
      next(error);
  }
});
 
 
sequelize.sync().then(() => {
  // Start the server after syncing
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
 
export default app;