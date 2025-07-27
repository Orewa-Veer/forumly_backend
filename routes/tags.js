import express from "express";
import { Tag, validateTag } from "../models/tags.js";
const router = express.Router();
router.get("/", async (req, res) => {
  const result = await Tag.find();
  res.json({ data: result });
});
router.post("/", async (req, res) => {
  const error = validateTag(req.body);
  if (error) return res.status(400).send(error);
  const tag = new Tag({ ...req.body });
  tag.save();
  res.send(tag);
});
export default router;
