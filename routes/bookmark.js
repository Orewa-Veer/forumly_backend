import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import { Bookmark } from "../models/bookmark.js";
import { Discussion } from "../models/discussion.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const bookmarks = await Bookmark.find({ user_id: req.user._id })
    .select("parent_id -_id")
    .populate({
      path: "parent_id",
      populate: { path: "user", select: "username" },
    });

  return res.json({ data: bookmarks });
});

router.post("/:id", auth, async (req, res) => {
  const discussId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(discussId))
    return res.status(400).json({ error: "Invalid Discussion Id" });
  const discuss = await Discussion.findById(discussId);
  if (!discuss)
    return res.status(400).json({ error: "No such Discussion exists" });

  const removed = await Bookmark.findOneAndDelete({
    user_id: req.user._id,
    parent_id: discussId,
  });
  if (removed) return res.json({ status: "removed" });
  else {
    const bookmark = await Bookmark.create({
      user_id: req.user._id,
      parent_id: discussId,
    });
    const newBook = await Bookmark.findById(bookmark._id)
      .select("parent_id -_id")
      .populate({
        path: "parent_id",
        populate: { path: "user", select: "username" },
      });
    return res.json({ status: "added", book: newBook });
  }
});

export default router;
