import express from "express";
import { Discussion } from "../models/Discussion.js";
import { Upvote, validateUpvote } from "../models/upvotes.js";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
const router = express.Router();
router.post("/:id", auth, async (req, res) => {
  const discussId = req.params.id;
  const error = validateUpvote(discussId);
  if (error) return res.status(400).json({ error: "Invalid Discussion Id" });
  const discuss = await Discussion.findById(discussId);
  if (!discuss)
    return res
      .status(404)
      .json({ error: "No such discussion found with the given Id" });
  const upvote = await Upvote.find({ user_id: req.user._id });
  if (upvote) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      await Upvote.findByIdAndDelete(upvote._id, { session });
      await Discussion.updateOne(
        { _id: discuss._id },
        { $inc: { upvoteCounter: -1 } },
        { session }
      );
      session.commitTransaction();
      res.send("Done Succesfully");
    } catch (ex) {
      session.abortTransaction();
      res.status(500).json({ error: ex });
    } finally {
      session.endSession();
    }
  } else {
    const upvote = new Upvote({
      user_id: req.user._id,
      parent_id: discussId,
    });
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      await upvote.save({ session });
      await Discussion.updateOne(
        { _id: discuss._id },
        { $inc: { upvoteCounter: 1 } },
        { session }
      );
      session.commitTransaction();
      res.send("Done Succesfully");
    } catch (ex) {
      session.abortTransaction();
      res.status(500).json({ error: ex });
    } finally {
      session.endSession();
    }
  }
});
export default router;
