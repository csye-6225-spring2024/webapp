import express from "express";
import healthzCheck from "../controllers/healthzController.js";
import checkDBConnection from "../middlewares/checkDBConnection.js";
 
const router = express.Router();
 
// Define route for handling GET request
router.get("/healthz", checkDBConnection, healthzCheck);
 
export default router;