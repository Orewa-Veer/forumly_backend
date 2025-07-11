import mongoose from "mongoose";
import Joi from "joi";
const upvotesSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  parent_id: { type: mongoose.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now() },
});
const Upvote = mongoose.model("Upvote", upvotesSchema);
const validateUpvote = (body) => {
  const schema = Joi.object({
    discussId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  const { error } = schema.validate(body);
  return error;
};
export { Upvote, validateUpvote };
