import express from "express";
import {
  createPayment,
  getPaymentsByUser,
} from "../controllers/controllers.js";

const router = express.Router();

router.post("/payments", createPayment);
router.get("/payments/:userId", getPaymentsByUser);

export default router;
