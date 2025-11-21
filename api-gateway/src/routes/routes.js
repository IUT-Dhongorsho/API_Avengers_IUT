import express from "express";
import {
  authController,
  campaignController,
  donationController,
  paymentController,
  notificationController,
} from "../controllers/controller.js";

const router = express.Router();

// Auth routes
router.use("/auth", authController);

// Campaign routes
router.use("/campaigns", campaignController);

// Donation routes
router.use("/donations", donationController);

// Payment routes
router.use("/payments", paymentController);

// Notifications routes
router.use("/notifications", notificationController);

export default router;
