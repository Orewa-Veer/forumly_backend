import mongoose from "mongoose";
import Joi from "joi";

import { ref } from "process";
import upvotesSchema from "./upvotes.js";
const repliesSchema = new mongoose.Schema({
  parentId: { type: mongoose.Types.ObjectId, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  body: { type: String, minlength: 10, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now() },
  upvotes: { type: [upvotesSchema], default: [] },
  isSolution: { type: Boolean, default: false },
});
const Reply = mongoose.model("Reply", repliesSchema);
function replyValidate(body) {
  const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
  const schema = Joi.object({
    body: Joi.string().required().max(20000),
  });
  const { error } = schema.validate(body);
  return error;
}
export { Reply, replyValidate, repliesSchema };
