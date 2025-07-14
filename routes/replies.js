import express from "express";

import { Reply, replyValidate } from "../models/replies.js";
import { Discussion } from "../models/Discussion.js";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
const router = express.Router();
router.get("/:id", async (req, res) => {
  const parentId = req.params.id;
  const discuss = await Discussion.findById(parentId);
  if (!discuss) return res.status(404).send("No such discussion found");
  const result = await Reply.find({ parentId: parentId }).populate("user");
  console.log("req.io exists? ", !!req.io);
  res.json(result);
});
router.post("/:id", auth, async (req, res) => {
  const parentId = req.params.id;
  // console.log(parentId);
  // console.log(req.user._id);
  const error = replyValidate(req.body);
  if (error)
    return res.status(400).json({ error: "There is a validation error" });
  const discuss = await Discussion.findById(parentId);
  if (!discuss)
    return res.status(404).json({ error: "No such discussion exists" });
  const reply = new Reply({
    user: req.user._id,
    parentId: parentId,
    body: req.body.body,
  });
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await reply.save({ session });
    await reply.populate({
      path: "user",
      select: "username name bio email location",
    });
    const newDiscuss = await Discussion.findOneAndUpdate(
      { _id: discuss._id },
      { $inc: { replyCounter: 1 } },
      { session, new: true }
    );
    await session.commitTransaction();
    // console.log(newDiscuss);
    req.io.to(`discussion:${parentId}`).emit("reply:updated", reply);
    req.io.to("questions:join").emit("discussions:updated", newDiscuss);
    res.json(reply);
  } catch (ex) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ error: "Could not save reply", details: ex.message });
  } finally {
    session.endSession();
  }
});
router.delete("/:id", auth, async (req, res) => {
  const reqId = req.params.id;
  const reply = await Reply.findById(reqId);
  if (!reply) return res.status(404).send("No such reply found");
  // console.log(`${reply.user}`);
  // console.log(req.user._id);
  if (`${reply.user}` !== req.user._id)
    return res.status(403).send("Forbidden");
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Reply.deleteOne({ _id: reply._id }, { session });
    const discuss = await Discussion.findOneAndUpdate(
      { _id: reply.parentId },
      { $inc: { replyCounter: -1 } },
      { session, new: true }
    );
    await session.commitTransaction();
    console.log(discuss);
    req.io.to(`discussion:${reply.parentId}`).emit("reply:deleted", reply);
    req.io.to("questions:join").emit("discussions:updated", discuss);
    res.send("Deleted Succesfully");
  } catch (ex) {
    await session.abortTransaction();
    res.status(500).json({ error: "Can not delete the reply" });
  } finally {
    session.endSession();
  }
});
export default router;
