// src/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/routes.js"; // your router file
// import connectDB from "./config/db.js"; // if you have a separate DB connection file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    // origin: process.env.CLIENT_URL || "http://localhost:3000",
    // credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.send({ status: "Auth Service is running" });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Auth-service running on port ${PORT}`);
});
