import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/register.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access Denied. No token provided");
  try {
    const decoded = jwt.verify(token, process.env.forumly_jwtPrivateKey);
    const user = await User.findById(decoded._id).select("-password");
    res.json(user);
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
});

export default router;
