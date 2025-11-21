import { prisma } from "./prisma.js";

export class BankingSystem {
  constructor() {
    this.queue = Promise.resolve(); // Ensures sequential processing
  }

  async createPayment(userId, amount) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    // Queue payment requests
    this.queue = this.queue.then(() => this._processPayment(userId, amount));
    return this.queue;
  }

  async _processPayment(userId, amount) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Fetch user to ensure they exist
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        // Simulate balance check (for future extensions)
        // const balance = user.balance;
        // if (balance < amount) throw new Error("Insufficient funds");

        // Create payment
        const payment = await tx.payment.create({
          data: {
            userId,
            amount,
            status: "COMPLETED",
          },
        });

        return payment;
      });
    } catch (err) {
      console.error("Payment processing error:", err.message);
      throw err;
    }
  }
}
