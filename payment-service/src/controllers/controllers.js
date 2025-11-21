import asyncHandler from "express-async-handler";
import prisma from "../utils/prisma.js";
import BankingSystem from "../utils/bankingSystem.js";

// POST /payments
export const createPayment = asyncHandler(async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    res.status(400);
    throw new Error("❌ userId and amount are required.");
  }

  try {
    const payment = await BankingSystem.processTransaction(prisma, {
      userId,
      amount,
    });
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /payments/:userId
export const getUserPayments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const payments = await prisma.payment.findMany({ where: { userId } });
  res.json({ success: true, payments });
});
