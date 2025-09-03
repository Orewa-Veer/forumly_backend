import express from "express";
import { Tag, validateTag } from "../models/tags.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await Tag.find();
  res.json({ data: result });
});

router.post("/", [auth, admin], async (req, res) => {
  const error = validateTag(req.body);
  if (error) return res.status(400).send(error);
  const tag = await Tag.create({ name: req.body.name, body: req.body.body });

  res.json({ data: tag });
});

export default router;
