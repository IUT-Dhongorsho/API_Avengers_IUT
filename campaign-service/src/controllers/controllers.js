import { prisma } from "../prisma";
import redis from "../utils/redis.js";

// Create a campaign
export const createCampaign = async (req, res) => {
  try {
    const { title, description, goalAmount, ownerId } = req.body;

    const campaign = await prisma.campaign.create({
      data: { title, description, goalAmount, ownerId },
    });

    // Invalidate cache
    await redis.del("campaigns:all");

    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

// Get all campaigns
export const getCampaigns = async (req, res) => {
  try {
    // 1) Check Redis first
    const cached = await redis.get("campaigns:all");

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // 2) Else fetch from DB
    const campaigns = await prisma.campaign.findMany();

    // 3) Cache for 30 seconds
    await redis.set("campaigns:all", JSON.stringify(campaigns), "EX", 30);

    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// Get single campaign
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    const cacheKey = `campaign:${id}`;

    // 1) Check Redis
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    // 2) Fetch from DB
    const campaign = await prisma.campaign.findUnique({ where: { id } });

    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    // 3) Cache campaign for 1 minute
    await redis.set(cacheKey, JSON.stringify(campaign), "EX", 60);

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};
