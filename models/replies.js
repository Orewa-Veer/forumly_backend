import Joi from "joi";
import mongoose from "mongoose";

const repliesSchema = new mongoose.Schema({
  parentId: { type: mongoose.Types.ObjectId, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  body: { type: String, minlength: 10, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now() },
  upvotesCounter: { type: Number, default: 0 },
  isSolution: { type: Boolean, default: false },
});
const Reply = mongoose.model("Reply", repliesSchema);
function replyValidate(body) {
  const schema = Joi.object({
    body: Joi.string().required().max(20000),
  });
  const { error } = schema.validate(body);
  return error;
}
export { repliesSchema, Reply, replyValidate };
