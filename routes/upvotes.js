import express from "express";
import { Discussion } from "../models/Discussion.js";
import { Upvote, validateUpvote } from "../models/upvotes.js";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import { Notification } from "../models/notifications.js";
const router = express.Router();
router.get("/", auth, async (req, res) => {
  const upvotes = await Upvote.find({ user_id: req.user._id }).lean();
  const dicussionIds = upvotes.map((up) => up.parent_id);
  const discussions = await Discussion.find({ _id: { $in: dicussionIds } });
  return res.json(discussions);
});
router.post("/:id", auth, async (req, res) => {
  const discussId = req.params.id;
  // console.log("req.io exists? ", !!req.io);
  // const error = validateUpvote({ discussId: discussId.toString() });
  if (!mongoose.Types.ObjectId.isValid(discussId))
    return res.status(400).json({ error: "Invalid Discussion id" });

  const discuss = await Discussion.findById(discussId);
  if (!discuss)
    return res
      .status(404)
      .json({ error: "No such discussion found with the given Id" });
  const removed = await Upvote.findOneAndDelete({
    user_id: req.user._id,
    parent_id: discuss._id,
  });
  let updateCounter = 0;
  if (removed) {
    updateCounter = -1;
  } else {
    const upvote = new Upvote({
      user_id: req.user._id,
      parent_id: discuss._id,
    });
    await upvote.save();
    updateCounter = 1;
  }
  await Discussion.updateOne(
    { _id: discussId },
    { $inc: { upvoteCounter: updateCounter } }
  );
  const updatedDiscuss = await Discussion.findById(discussId);
  const newNotific = await Notification.create({
    userId: updatedDiscuss.user,
    type: "upvote",
    discussId: updatedDiscuss._id,
  });
  req.io.to("questions:join").emit("discussions:updated", updatedDiscuss);
  req.io.to(`room:${updatedDiscuss.user}`).emit("notification:new", newNotific);
  return res.json({
    status: removed ? "removed" : "added",
    upvoteCounter: updatedDiscuss.upvoteCounter,
  });
});
export default router;
