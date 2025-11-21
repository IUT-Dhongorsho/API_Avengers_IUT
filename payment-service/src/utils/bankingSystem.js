import { prisma } from "./prisma.js";

class BankingSystem {
  constructor() {
    this.queue = Promise.resolve(); // ensures sequential transaction processing
  }

  async processTransaction(paymentServiceClient, payment) {
    // Queue transactions to prevent race conditions
    this.queue = this.queue.then(async () => {
      // Start atomic transaction
      const prisma = paymentServiceClient; // pass in Prisma client
      return await prisma.$transaction(async (tx) => {
        // Check amount validity
        if (payment.amount <= 0) {
          throw new Error("❌ Invalid transaction amount.");
        }

        // Insert Payment
        const newPayment = await tx.payment.create({
          data: {
            userId: payment.userId,
            amount: payment.amount,
            status: "PENDING",
          },
        });

        // Simulate actual banking process
        // (In real system, call external API here)
        newPayment.status = "COMPLETED";
        return await tx.payment.update({
          where: { id: newPayment.id },
          data: { status: newPayment.status },
        });
      });
    });

    return this.queue;
  }
}

export default new BankingSystem();
