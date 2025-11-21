import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
} from "../controllers/controller.js";
import protect from "../../../shared/common-lib/src/middlewares/authMiddleware.js";

const router = express.Router();

// POST /campaigns -> create new campaign
router.post("/", protect, createCampaign);

// GET /campaigns -> list all campaigns
router.get("/", getCampaigns);

// GET /campaigns/:id -> get single campaign
router.get("/:id", getCampaignById);

export default router;
