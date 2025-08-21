import Joi from "joi";
import mongoose from "mongoose";
import { Discussion } from "./discussion.js";
const bookmarkSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  parent_id: { type: mongoose.Types.ObjectId, ref: Discussion, required: true },
  date: { type: Date, default: Date.now() },
});
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
const validateBookmark = (body) => {
  const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
  const schema = Joi.object({
    parent_id: objectId.required(),
  });
  const { error } = schema.validate(body);
  return error;
};
export { Bookmark, validateBookmark };
