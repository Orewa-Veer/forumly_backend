import logger from "./logger.js";

export default async function err(err, req, res, next) {
  logger.error(err.message, err);
}
