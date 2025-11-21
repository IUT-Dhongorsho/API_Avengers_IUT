import { prisma } from "../prisma";
// Create a campaign
export const createCampaign = async (req, res) => {
  try {
    const { title, description, goalAmount, ownerId } = req.body;
    const campaign = await prisma.campaign.create({
      data: { title, description, goalAmount, ownerId },
    });
    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

// Get all campaigns
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany();
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// Get single campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};
