import express from "express";
import { Reply, replyValidate } from "../models/replies";
import { Discussion } from "../models/Discussion";
import mongoose from "mongoose";
const router = express.Router();
router.get("/:id", async (req, res) => {
  const parentId = req.params.id;
  const discuss = await Discussion.findById(id);
  if (!discuss) return res.status(404).send("No such discussion found");
  const result = await Reply.find({ parentId: parentId });
  res.json(result);
});
router.post("/:id", auth, async (req, res) => {
  const parentId = req.params.id;
  const error = replyValidate(req.body);
  if (error) return res.status(400).send(error);
  const discuss = await Discussion.findById(id);
  if (!discuss) return res.status(404).send("No such discussion found");
  const reply = new Reply({
    user: req.user._id,
    parentId: id,
    body: req.body,
  });
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await reply.save({ session });
    await Discussion.updateOne(
      { _id: discuss._id },
      { $inc: { replyCounter: 1 } },
      { session }
    );
    await session.commitTransaction();
    res.json(reply);
  } catch (ex) {
    await session.abortTransaction();
    res.status(500).json({ error: "Could not save reply" });
  } finally {
    session.endSession();
  }
});
router.delete("/:id", auth, async (req, res) => {
  const reqId = req.params.id;
  const reply = await Reply.findById(reqId);
  if (!reply) return res.status(404).send("No such reply found");
  if (reply.user !== req.user._id) return res.status(403).send("Forbidden");
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Reply.deleteOne({ _id: reply._id }, { session });
    await Discussion.updateOne(
      { _id: reply.parentId },
      { $inc: { replyCounter: -1 } },
      { session }
    );
    await session.commitTransaction();
  } catch (ex) {
    await session.abortTransaction();
    res.status(500).json({ error: "Can not delete the reply" });
  } finally {
    session.endSession();
  }
});
