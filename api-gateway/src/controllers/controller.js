import { proxyRequest } from "../utils/requestProxy.js";

const SERVICE_URLS = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:5000",
  campaign: process.env.CAMPAIGN_SERVICE_URL || "http://campaign-service:5001",
  donation: process.env.DONATION_SERVICE_URL || "http://donation-service:5002",
  payment: process.env.PAYMENT_SERVICE_URL || "http://payment-service:5003",
  notification:
    process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:5004",
};

// Example: proxy all auth requests
export const authController = (req, res) =>
  proxyRequest(req, res, SERVICE_URLS.auth);

export const campaignController = (req, res) =>
  proxyRequest(req, res, SERVICE_URLS.campaign);

export const donationController = (req, res) =>
  proxyRequest(req, res, SERVICE_URLS.donation);

export const paymentController = (req, res) =>
  proxyRequest(req, res, SERVICE_URLS.payment);

export const notificationController = (req, res) =>
  proxyRequest(req, res, SERVICE_URLS.notification);
