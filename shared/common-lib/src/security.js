import Arcjet, { tokenBucket, detectBot } from "@arcjet/node";
import env from "./env.js";
import logger from "./logger.js";
import { RateLimitError } from "./errors.js";

const aj = new Arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["ip.src"],
});

const rateLimitRule = tokenBucket({
  refillRate: 1000,
  interval: "60s",
  capacity: 1000,
});

const botDetectionRule = detectBot({
  mode: "CHALLENGE",
  blockForeignJsSDK: true,
});

export const securityMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      rules: [rateLimitRule, botDetectionRule],
    });

    logger.logInfo("Arcjet decision", {
      requestId: req.id,
      decision: decision.conclusion,
    });

    // Handle rate limit
    if (decision.rateLimited) {
      logger.logWarn("Rate limit exceeded", { ip: req.ip });
      throw new RateLimitError();
    }

    if (decision.botScore > 0.8) {
      logger.logWarn("Bot detected", { ip: req.ip, score: decision.botScore });
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

export default { securityMiddleware, isValidEmail, sanitizeInput };
