import mongoose from "mongoose";
import Joi from "joi";
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  body: { type: String, required: true },
});
const Tag = mongoose.model("Tag", tagSchema);
function validateTag(body) {
  const schema = Joi.object({
    name: Joi.string().required().max(100).min(1),
    body: Joi.string().required().max(1000).min(10),
  });
  const { error } = schema.validate(body);
  return error;
}
export { Tag, tagSchema, validateTag };
