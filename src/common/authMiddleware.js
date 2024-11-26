import dotenv from "dotenv";

dotenv.config(); // Load Environment Variables

const validatePassword = (req, res, next) => {
  const password = req.headers.password || req.query.password; // Check headers or query params
  const authorizedPassword = process.env.AUTHORIZED_PASSWORD;

  if (!password) {
    console.log("No password provided");
    return res.status(401).json({ message: "Unauthorized: Password required" });
  }

  if (password !== authorizedPassword) {
    console.log("Invalid password provided");
    return res.status(403).json({ message: "Forbidden: Invalid password" });
  }

  console.log("Password is valid");
  next();
};

export default validatePassword;
