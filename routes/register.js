import express from "express";
import { User, userValidate } from "../models/register.js";
import bcrypt from "bcrypt";
import pick from "lodash.pick";

const router = express.Router();

router.post("/", async (req, res) => {
  const error = userValidate(req.body);
  if (error) return res.status(400).send(error);
  let user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });
  if (user)
    return res
      .status(400)
      .send("User with the given email or username already exists");
  user = new User({ ...req.body });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  const token = user.generateToken();
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, //switch to true
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json(pick(user, ["_id", "username", "email"]));
});

export default router;
