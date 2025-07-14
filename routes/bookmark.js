import express from "express";
import { Bookmark, validateBookmark } from "../models/bookmark.js";
import auth from "../middleware/auth.js";
import { Discussion } from "../models/Discussion.js";
import mongoose from "mongoose";
const router = express.Router();
router.post("/:id", auth, async (req, res) => {
  const discussId = req.params.id;
  //   console.log(discussId);
  const error = validateBookmark({ parent_id: discussId });
  if (error) return res.status(400).json({ error: "Invalid discussion Id" });
  const discuss = await Discussion.findById(discussId);
  if (!discuss)
    return res.status(400).json({ error: "No such Discussion exists" });
  let bookmark = await Bookmark.findOne({
    user_id: req.user._id,
    parent_id: discussId,
  });
  const session = await mongoose.startSession();
  if (bookmark) {
    try {
      session.startTransaction();
      await Bookmark.findByIdAndDelete(bookmark._id, { session });
      await discuss.updateOne({ $inc: { bookmarks: -1 } }, { session });
      const updated = await Discussion.findById(discuss._id).select(
        "bookmarks"
      );
      await session.commitTransaction();
      return res.json({ status: "removed", bookmarks: updated.bookmarks });
    } catch (ex) {
      await session.abortTransaction();
      return res
        .status(500)
        .json({ error: "Internal error", message: ex.message });
    } finally {
      await session.endSession();
    }
  } else {
    bookmark = new Bookmark({
      user_id: req.user._id,
      parent_id: discussId,
    });
    try {
      session.startTransaction();
      await bookmark.save({ session });
      await discuss.updateOne({ $inc: { bookmarks: 1 } }, { session });
      const updated = await Discussion.findById(discuss._id).select(
        "bookmarks"
      );
      await session.commitTransaction();
      return res.json({ status: "added", bookmarks: updated.bookmarks });
    } catch (ex) {
      await session.abortTransaction();
      return res
        .status(500)
        .json({ error: "Internal error", message: ex.message });
    } finally {
      await session.endSession();
    }
  }
});
export default router;
