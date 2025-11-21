import { Resend } from "resend";
import env from "./env.js";
import logger from "./logger.js";

const resend = new Resend(env.RESEND_API_KEY)

export const sendEmail = async (to, subject, html) => {
  try {
    const result = await resend.emails.send({
      from: env.SENDER_EMAIL,
      to,
      subject,
      html,
    });

    logger.info(`Email sent to ${to}`,);
    return result;
    
  } catch (error) {
    logger.error(`Failed to send email to ${to}`, { error });
    throw error;
  }
};

export const sendOtpEmail = async (to, otp) => {
  const html = `
    <h2>Your OTP Code</h2>
    <p>Your One-Time Password is:</p>
    <h1 style="font-size: 32px; letter-spacing: 2px;">${otp}</h1>
    <p>Valid for ${env.OTP_EXPIRY_MINUTES} minutes</p>
    <p>Do not share this code with anyone.</p>
  `;

  return sendEmail(to, "Your OTP Code - CareForAll", html);
};

export const sendWelcomeEmail = async (to, firstName) => {
  const html = `
    <h2>Welcome to CareForAll!</h2>
    <p>Hi ${firstName},</p>
    <p>Thank you for joining our donation platform.</p>
    <a 
        href="https://careforall.com/campaigns" 
    </a>
  `;

  return sendEmail(to, "Welcome to CareForAll!", html);
};

export const sendDonationConfirmation = async (to, pledgeId, amount, campaignTitle) => {
  const html = `
    <h2>Donation Confirmed!</h2>
    <p>Thank you for your generous donation of $${amount}</p>
    <p><strong>Campaign:</strong> ${campaignTitle}</p>
    <p><strong>Pledge ID:</strong> ${pledgeId}</p>
    <p>Your contribution is making a real impact!</p>
  `;

  return sendEmail(to, "Donation Confirmation - CareForAll", html);
};

export default { sendEmail, sendOtpEmail, sendWelcomeEmail, sendDonationConfirmation };
