import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/controller.js";
// import protect from "../../../shared/common-lib/src/middlewares/authMiddleware.js";

const router = express.Router();

// POST /auth/register
router.post("/register", registerUser);

// POST /auth/login
router.post("/login", loginUser);

// POST /auth/logout
router.post("/logout", logoutUser);

// // GET /auth/refresh
// router.get("/refresh", protect, refreshToken);

export default router;
