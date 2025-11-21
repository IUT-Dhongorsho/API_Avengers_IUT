import * as Sentry from "@sentry/node";
import pino from "pino";
import env from "./env.js";

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.ENVIRONMENT,
    tracesSampleRate: 1.0,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }), 
        Sentry.pinoIntegration({ log: { levels: ["info", "warn", "error"] } })
    ],
  });
}

const logger = pino({
  level: env.LOG_LEVEL,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  },
});

const logError = (error, context = {}) => {
  logger.error(error);

  if (env.SENTRY_DSN) {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  }
};

const logInfo = (message, data = {}) => {
  logger.info({ ...data }, message);
};

const logWarn = (message, data = {}) => {
  logger.warn({ ...data }, message);
};

export default { logError, logInfo, logWarn, logger };