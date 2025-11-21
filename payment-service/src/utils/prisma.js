// // prisma.config.js
// import {PrismaClient} from "@prisma/client";

// export const prisma = new PrismaClient({
//   adapter: {
//     type: "postgresql",
//     url: process.env.DATABASE_URL, // e.g., postgres://username:password@localhost:5432/authdb
//   },
// });


// src/utils/prisma.js
// import { PrismaClient } from "@prisma/client";

// // For direct database connection
// const prisma = new PrismaClient({
//   datasource: {
//     url: process.env.DATABASE_URL,
//   },
// });

// export default prisma;


// import { PrismaClient } from "@prisma/client";

// let prismaClient;

// if (process.env.NODE_ENV === "production") {
//   prismaClient = new PrismaClient();
// } else {
//   // Prevent creating multiple clients during development (nodemon/hot-reload)
//   if (!globalThis.__prismaClient) {
//     globalThis.__prismaClient = new PrismaClient();
//   }
//   prismaClient = globalThis.__prismaClient;
// }

// // Provide both named and default exports so consumers can use either import style
// export const prisma = prismaClient;
// export default prismaClient;


// src/services/BankingSystem.js
import prisma from "../utils/prisma.js";

class BankingSystem {
  constructor() {
    this.queue = Promise.resolve();
  }

  async processTransaction(paymentServiceClient, payment) {
    // Use passed-in client if provided and valid, otherwise use the singleton prisma
    const client = (paymentServiceClient && typeof paymentServiceClient.$transaction === 'function') 
      ? paymentServiceClient 
      : prisma;

    this.queue = this.queue.then(async () => {
      return await client.$transaction(async (tx) => {
        // Check amount validity
        if (payment.amount <= 0) {
          throw new Error("❌ Invalid transaction amount.");
        }

        // Validate required fields
        if (!payment.userId) {
          throw new Error("❌ User ID is required.");
        }

        // Insert Payment
        const newPayment = await tx.payment.create({
          data: {
            userId: payment.userId,
            amount: payment.amount,
            status: "PENDING",
          },
        });

        console.log(`✅ Payment ${newPayment.id} created with PENDING status`);

        // Simulate actual banking process
        // (In real system, call external API here)
        return await tx.payment.update({
          where: { id: newPayment.id },
          data: { status: "COMPLETED" },
        });
      });
    });

    return this.queue;
  }

  // Add a method to check database connection
  async checkConnection() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('❌ Database connection check failed:', error);
      return false;
    }
  }
}

export default new BankingSystem();