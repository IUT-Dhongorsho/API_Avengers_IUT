import { verifyToken } from "./jwt.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized. No token." });
  }

  try {
    const decoded = verifyToken(token);

    // Attach decoded values only
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "user",
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
