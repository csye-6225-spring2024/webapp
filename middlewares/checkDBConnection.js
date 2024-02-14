import { sequelize } from "../models/healthzModel.js";
 
// Function to check the DB connection
const checkDBConnection = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    console.log("DB connection is successful");
    next();
  } catch (error) {
    console.error("Service unavailable: connection is unsuccessful", error);
    res
      .status(503)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("X-Content-Type-Options", "nosniff")
      .send();
  }
};
 
export default checkDBConnection;