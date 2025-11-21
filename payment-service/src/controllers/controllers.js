import asyncHandler from "express-async-handler";
import { BankingSystem } from "../utils/bankingSystem.js";

const bank = new BankingSystem();

// POST /payments
export const createPayment = asyncHandler(async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    res.status(400);
    throw new Error("userId and amount are required");
  }

  try {
    const payment = await bank.createPayment(userId, amount);
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /payments/:userId
export const getPaymentsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const payments = await bank.queue.then(() =>
    bank._processPayment(userId, 0).catch(() => [])
  );
  res.json({ success: true, payments });
});
