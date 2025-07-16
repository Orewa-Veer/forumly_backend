import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  type: { type: String, enum: ["reply", "upvote"], required: true },
  discussId: { type: mongoose.Types.ObjectId, required: true },
  seen: { type: Boolean, default: false },
});
const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
