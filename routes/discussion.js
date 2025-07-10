import express from "express";
import { Discussion, discussValidate } from "../models/Discussion.js";
import { User } from "../models/register.js";
import { Tag } from "../models/tags.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.get("/", auth, async (req, res) => {
  const {
    sort = "createdAt",
    order = "desc",
    page,
    limit,
    ...filters
  } = req.query;
  const sortOrder = order === "asc" ? 1 : -1;
  if (page) page = parseInt(page);
  if (limit) limit = parseInt(limit);
  const result = await Discussion.find({ ...filters })
    .populate("user")
    .sort({ [sort]: sortOrder })
    .limit(limit)
    .skip((page - 1) * limit);
  res.json(result);
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Discussion.findById(id);
  res.json(result);
});
router.post("/", auth, async (req, res) => {
  const error = discussValidate(req.body);
  if (error) return res.status(400).send(error);
  const user = await User.findById(req.body.userId);
  if (!user)
    return res.status(400).send("No such user exists with the given id");
  const allTags = await Promise.all(
    req.body.tagId.map(async (tag) => {
      const tagin = await Tag.findById(tag);
      if (!tagin) throw new Error("No such tag exists with the given id");

      return tagin;
    })
  );
  console.log(allTags);
  const discussion = new Discussion({
    title: req.body.title,
    body: req.body.body,
    user: { _id: user._id },
    tags: allTags,
  });
  await discussion.save();
  res.send(discussion);
});
router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const discuss = await Discussion.findById(id);
  if (!discuss) return res.status(400).send("No such discussion exits");
  if (discuss._id !== req.user._id) return res.status(403).send("Forbidden");
  const deleted = await Discussion.findByIdAndDelete(id);
  res.json(deleted);
});
export default router;
