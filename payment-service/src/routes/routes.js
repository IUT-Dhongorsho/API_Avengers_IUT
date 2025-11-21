import express from "express";
import { createPayment, getUserPayments } from "../controllers/controllers.js";

const router = express.Router();

router.post("/", createPayment);
router.get("/:userId", getUserPayments);

export default router;
