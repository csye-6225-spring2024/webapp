import sequelize from '../config/dbConfig.js';


// Checks database connectivity for all methods
const dbConnection = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    next(); 
  } catch (error) {
    console.error('Database Connectivity Error:', error);
    res
      .status(503)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("X-Content-Type-Options", "nosniff")
      .end();
  }
}; 

// Health Check Endpoint
const healthCheck = async (req, res) => {
  try {
    if (req.method === 'GET') {
      //await Model.create({ status: 'OK' });
      res
        .status(200)
        .header('Cache-Control', 'no-cache, no-store, must-revalidate')
        .header('Pragma', 'no-cache')
        .header('X-Content-Type-Options', 'nosniff')
        .end();
    }
  } catch (error) {
    console.error('Health Check Error:', error);
    res
        .status(500)
        .header('Cache-Control', 'no-cache, no-store, must-revalidate')
        .header('Pragma', 'no-cache')
        .header('X-Content-Type-Options', 'nosniff')
        .end();
  }
}; 

export {
  dbConnection,
  healthCheck,
};
