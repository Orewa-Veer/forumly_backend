import winston from "winston";

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(), // adds colors
    winston.format.timestamp(), // adds timestamp
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console(),
    // new winston.transports.MongoDB({ db: process.env.MONGO_URI }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.Console(),
  ],
});
logger.rejections.handle(
  new winston.transports.File({ filename: "uncaughtRejections.log" })
);
export default logger;
