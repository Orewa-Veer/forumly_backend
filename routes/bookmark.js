import express from "express";
import { Bookmark, validateBookmark } from "../models/bookmark.js";
import auth from "../middleware/auth.js";
import { Discussion } from "../models/Discussion.js";
import mongoose from "mongoose";
const router = express.Router();
router.get("/", auth, async (req, res) => {
  const bookmarks = await Bookmark.find({ user_id: req.user._id })
    .select("parent_id -_id")
    .populate({
      path: "parent_id",
      populate: { path: "user", select: "username" },
    });
  // console.log(bookmarks);
  // const bookmarkCount = await Bookmark.find({
  //   user_id: req.user._id,
  // }).countDocuments();

  return res.json(bookmarks);
});
router.post("/:id", auth, async (req, res) => {
  const discussId = req.params.id;
  //   console.log(discussId);
  // const error = validateBookmark({ parent_id: discussId });
  if (!mongoose.Types.ObjectId.isValid(discussId))
    return res.status(400).json({ error: "Invalid Discussion Id" });
  // if (error) return res.status(400).json({ error: "Invalid discussion Id" });
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
    // console.log("This is the new bookmark", newBook);
    return res.json({ status: "added", book: newBook });
  }
});
export default router;
