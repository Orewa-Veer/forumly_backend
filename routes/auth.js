import express from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import { User } from "../models/register.js";
import pick from "lodash.pick";
const router = express.Router();
router.post("/", async (req, res) => {
  console.log("Login endpoint hit");
  // console.log("REQ.IO:", req.io);

  // Try emitting something just to see if req.io works
  if (req.io) {
    // console.log("Emitting test event...");
    // req.io.emit("test:event", { test: true });
  } else {
    console.log("req.io is undefined!");
  }
  const error = validate(req.body);
  if (error) return res.status(400).send(error);
  const user = await User.findOne().or([
    { email: req.body.email },
    { username: req.body.username },
  ]);
  if (!user) return res.status(400).send("Invalid username or password ");
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword)
    return res.status(400).send("Invalid username of password");
  const token = user.generateToken();
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, //swicth back to true and strict
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json(pick(user, ["_id", "username", "email"]));
});

function validate(body) {
  const schema = Joi.object({
    username: Joi.string().required().max(255).min(1),
    email: Joi.string().email().required().max(255),
    password: Joi.string().required().max(255),
  });
  const { error } = schema.validate(body);
  return error;
}
export default router;
