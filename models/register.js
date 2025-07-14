import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import config from "config";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
    unique: true,
  },
  name: { type: String, required: true, minlength: 4, maxlength: 255 },
  bio: { type: String, maxlength: 1000 },
  email: { type: String, maxlength: 255, required: true, unique: true },
  location: { type: String, maxlength: 255 },
  password: { type: String, required: true, maxlength: 255, minlength: 8 },
  admin: { type: Boolean, default: false },
});
userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { _id: this._id, admin: this.admin },
    config.get("jwtPrivateKey"),
    { expiresIn: "1d" }
  );
  return token;
};
const User = mongoose.model("User", userSchema);
function userValidate(body) {
  const schema = Joi.object({
    username: Joi.string().required().max(255).min(4),
    name: Joi.string().required().max(255).min(4),
    email: Joi.string().max(255).email().required(),
    password: Joi.string().max(255).min(8).required(),
  });
  const { error } = schema.validate(body);
  return error;
}
export { User, userValidate, userSchema };
