import Joi from "joi";
import mongoose from "mongoose";

import upvotesSchema from "./upvotes.js";
const discussionSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, minlength: 10, maxlength: 1000 },
  body: { type: String, minlength: 10, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now() },
  replyCounter: { type: Number, default: 0 },
  tags: [
    {
      _id: false,
      tagId: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
  ],
  upvotes: { type: [upvotesSchema], default: [] },
  isSolved: { type: Boolean, default: false },
});
const Discussion = mongoose.model("Discussion", discussionSchema);
function discussValidate(body) {
  const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
  const schema = Joi.object({
    userId: objectId.required(),
    tagId: Joi.array().items(objectId).min(1),
    title: Joi.string().required().max(1000),
    body: Joi.string().required().max(20000),
  });
  const { error } = schema.validate(body);
  return error;
}
export { Discussion, discussValidate };
