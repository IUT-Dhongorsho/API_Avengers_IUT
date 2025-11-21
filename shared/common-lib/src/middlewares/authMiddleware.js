import asyncHandler from "express-async-handler";

// Protect middleware to secure routes
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  try {
    if (!token) {
      res.status(401);
      throw new Error("❌ Not authorized. No token provided.");
    }
    // Verify token using secret

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401);
    throw new Error("❌ Not authorized. Invalid or expired token.");
  }
});

export default protect;
