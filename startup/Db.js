import mongoose from "mongoose";
import logger from "../middleware/logger.js";

export default async function () {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      logger.info("Connected to MongoDB");
    })
    .catch((ex) => {
      logger.error("Could not connect to MongoDB: ", ex);
      process.exit(1);
    });
}
