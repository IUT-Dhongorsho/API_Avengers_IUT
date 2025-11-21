import { kafka, createConsumer } from "../../../shared/kafka.config.js";
import logger from "../../../shared/common-lib/src/logger.js";
import { sendOtpEmail, sendDonationConfirmation, sendWelcomeEmail } from "../../../shared/common-lib/src/email.js";

const consumer = createConsumer('email-notification-group');

const sendWithRetry = async (sendFunction, email, context, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendFunction;
      
      if (result && result.id) {
        logger.logInfo(`Email sent successfully via Resend`, {
          to: email,
          attempt,
          messageId: result.id
        });
        return result;
      } else {
        throw new Error('Resend did not return a message ID');
      }
      
    } catch (error) {
      if (attempt === maxRetries) {
        logger.logError(error, {
          context: `Final attempt failed for ${context}`,
          to: email,
          attempt
        });
        throw error;
      }
      
      logger.logWarn(`Attempt ${attempt} failed for ${context}, retrying...`, {
        to: email,
        error: error.message
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
  }
};

export const startEmailConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'email-notifications', fromBeginning: false });
    
    logger.logInfo("Email consumer started and subscribed");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const emailData = JSON.parse(message.value.toString());
          logger.logInfo("Processing email event", { 
            to: emailData.to, 
            template: emailData.template 
          });

          let result;
          switch (emailData.template) {
            case 'otp':
              result = await sendWithRetry(
                sendOtpEmail(emailData.to, emailData.otp),
                emailData.to,
                'OTP email'
              );
              break;
              
            case 'donation_confirmation':
              result = await sendWithRetry(
                sendDonationConfirmation(
                  emailData.to, 
                  emailData.pledgeId, 
                  emailData.amount, 
                  emailData.campaignTitle
                ),
                emailData.to,
                'donation confirmation'
              );
              break;
              
            case 'welcome':
              result = await sendWithRetry(
                sendWelcomeEmail(emailData.to, emailData.firstName),
                emailData.to,
                'welcome email'
              );
              break;
              
            default:
              logger.logWarn("Unknown email template", { template: emailData.template });
              return;
          }
          
          logger.logInfo("Email processed successfully", { 
            to: emailData.to,
            messageId: result.id,
            template: emailData.template
          });
          
        } catch (error) {
          logger.logError(error, { 
            context: "Failed to process email",
            message: message.value.toString()
          });
          // Message will not be committed and will be retried by Kafka
        }
      },
    });
  } catch (error) {
    logger.logError(error, { context: "Email consumer startup failed" });
    throw error;
  }
};

const shutdown = async () => {
  try {
    await consumer.stop();
    await consumer.disconnect();
    logger.logInfo("Email consumer stopped");
  } catch (error) {
    logger.logError(error, { context: "Error during shutdown" });
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);