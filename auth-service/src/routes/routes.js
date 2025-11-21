import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

// POST /auth/register
router.post("/register", registerUser);

// POST /auth/login
router.post("/login", loginUser);

// POST /auth/logout
router.post("/logout", logoutUser);

// GET /auth/refresh
router.get("/refresh", refreshToken);

export default router;
