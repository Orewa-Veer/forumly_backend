import mongoose from "mongoose";
import { Tag } from "./models/tags.js";
import { Discussion } from "./models/discussion.js";
import logger from "./middleware/logger.js";

await mongoose.connect("mongodb://localhost/formuly").catch((ex) => {
  logger.error("Could not connect to MongoDB: ", ex);
  process.exit(1);
});

const tags = await Tag.find();
for (const tag of tags) {
  const count = await Discussion.countDocuments({
    "tags._id": tag._id,
  });
  await Tag.updateOne(
    {
      _id: tag._id,
    },
    {
      $set: {
        questionCounter: count,
      },
    }
  );
}
console.log("Tags questionCounter Updated");

await mongoose.disconnect();
