import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DB_URL: z.string().url(),   
    REDIS_URL: z.string().url(),
    KAFKA_BROKERS: z.string(),
    KAFKA_CLIENT_ID: z.string(),
    RESEND_API_KEY: z.string().min(1),
    SENDER_EMAIL: z.string().email(),
    OTP_EXPIRY_MINUTES: z.number().default(10),
    OTP_LENGTH: z.number().default(6),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRY_DAYS: z.number().default(7),
    SENTRY_DSN: z.string().url().optional(),
    ARCJET_KEY: z.string().min(1),
    
  },
  
  runtimeEnv: process.env,
  
  // Allow unused env vars in client (optional)
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});

export default env;