// prisma.config.js
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  adapter: {
    type: "postgresql",
    url: process.env.DATABASE_URL, // e.g., postgres://username:password@localhost:5432/authdb
  },
});
