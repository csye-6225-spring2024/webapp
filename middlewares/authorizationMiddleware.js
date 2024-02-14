import { User } from "../models/healthzModel.js";
import bcrypt from "bcrypt";
import { Buffer } from "buffer";
 
// Middleware function for authentication
const basicAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
 
  if (req.headers.authorization === undefined) {
    return res.status(403).json({ message: "Authorization header is missing." });
  }
  
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ message: "Unauthorized User" });
  }
  const token = authHeader.split(" ")[1];
  const decodedToken = Buffer.from(token, "base64").toString("utf-8");
  const [username, password] = decodedToken.split(":");
  try {
    // Find the user in  DB
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const encodedPassword = Buffer.from(password).toString("base64");
    const passwordsMatch = await bcrypt.compare(encodedPassword, user.password);
    if (!passwordsMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect password" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
 
export default basicAuth;