import { Kafka, Partitioners } from "kafkajs";
import env from "./env.js";
import logger from "./logger.js";

export const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS.split(","),
  retry: {
    initialRetryTime: 100,
    retries: 8,
    maxRetryTime: 30000,
    multiplier: 2,
  },
  connectionTimeout: 10000,
  requestTimeout: 30000,
  logLevel: 1,
});

export const producer = kafka.producer({
  idempotent: true,
  createPartitioner: Partitioners.LegacyPartitioner,
  maxInFlightRequests: 5,
  transactionTimeout: 60000,
});

export const connectProducer = async () => {
  try {
    await producer.connect();
    logger.logInfo("Kafka Producer connected");
  } catch (error) {
    logger.logError(error, { context: "Kafka Producer Connection" });
    throw error;
  }
};

export const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    logger.logInfo("Kafka Producer disconnected");
  } catch (error) {
    logger.logError(error, { context: "Kafka Producer Disconnection" });
  }
};

export const sendEvent = async (topic, key, data) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: key || Date.now().toString(),
          value: JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
            source: env.KAFKA_CLIENT_ID
          }),
        },
      ],
    });

    logger.logInfo("Event sent to Kafka", { 
      topic, 
      key,
      type: data.type 
    });
  } catch (error) {
    logger.logError(error, { 
      context: "Kafka Event Sending Failed",
      topic,
      key 
    });
    throw error;
  }
};

export const sendEmailEvent = async (data) => {
  return sendEvent("email-notifications", data.to, data);
};

export const sendPaymentEvent = async (paymentData) => {
  return sendEvent("payment-events", paymentData.paymentId, {
    type: 'PAYMENT_PROCESSED',
    data: paymentData
  });
};

export const sendPledgeEvent = async (pledgeData) => {
  return sendEvent("pledge-events", pledgeData.pledgeId, {
    type: 'PLEDGE_CREATED', 
    data: pledgeData
  });
};

export const sendCampaignEvent = async (campaignData) => {
  return sendEvent("campaign-events", campaignData.campaignId, {
    type: 'CAMPAIGN_UPDATED',
    data: campaignData
  });
};

// Helper functions for common use cases
export const sendOtpEvent = async (email, otp, type = "registration") => {
  return sendEmailEvent({
    to: email,
    template: "otp",
    type,
    otp,
  });
};

export const sendDonationEvent = async (email, pledgeId, amount, campaignTitle) => {
  return sendEmailEvent({
    to: email,
    template: "donation_confirmation",
    type: "donation",
    pledgeId,
    amount,
    campaignTitle,
  });
};

export const sendWelcomeEvent = async (email, firstName) => {
  return sendEmailEvent({
    to: email,
    template: "welcome", 
    type: "welcome",
    firstName,
  });
};

// Consumer factory function
export const createConsumer = (groupId, options = {}) => {
  return kafka.consumer({ 
    groupId,
    sessionTimeout: 30000,
    rebalanceTimeout: 60000,
    heartbeatInterval: 3000,
    maxBytesPerPartition: 1048576, // 1MB
    ...options
  });
};

export default {
  kafka,
  producer,
  connectProducer,
  disconnectProducer,
  sendEvent,
  sendEmailEvent,
  sendPaymentEvent,
  sendPledgeEvent,
  sendCampaignEvent,
  sendOtpEvent,
  sendDonationEvent,
  sendWelcomeEvent,
  createConsumer
};