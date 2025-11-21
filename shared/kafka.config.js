import { Kafka } from "kafkajs";
import env from "./env.js";
import logger from "./common-lib/src/logger.js";

export const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS.split(","),
  retry: {
    initialRetryTime: 100,
    retries: 8,
    maxRetryTime: 30000,
  },
});

export const producer = kafka.producer();

export const connectProducer = async () => {
  try {
    await producer.connect();
    logger.logInfo("Kafka Producer connected");
  } catch (error) {
    logger.logError(error, { context: "Kafka Producer Connection" });
    throw error;
  }
};

export const sendEmailEvent = async (data) => {
  try {
    await producer.send({
      topic: "email-notifications",
      messages: [
        {
          key: data.to,
          value: JSON.stringify(data),
        },
      ],
    });

    logger.logInfo("Email event sent to Kafka", { to: data.to });
  } catch (error) {
    logger.logError(error, { context: "Kafka Email Event" });
    throw error;
  }
};