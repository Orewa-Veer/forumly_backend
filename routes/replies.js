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
  res.json(result);
});
router.post("/:id", auth, async (req, res) => {
  const parentId = req.params.id;
  console.log(parentId);
  console.log(req.user._id);
  const error = replyValidate(req.body);
  if (error) return res.status(400).send(error, "This is validation error");
  const discuss = await Discussion.findById(parentId);
  if (!discuss) return res.status(404).send("No such discussion found");
  const reply = new Reply({
    user: req.user._id,
    parentId: parentId,
    body: req.body.body,
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
    res.status(500).send(ex).json({ error: "Could not save reply" });
  } finally {
    session.endSession();
  }
});
router.delete("/:id", auth, async (req, res) => {
  const reqId = req.params.id;
  const reply = await Reply.findById(reqId);
  if (!reply) return res.status(404).send("No such reply found");
  console.log(`${reply.user}`);
  console.log(req.user._id);
  if (`${reply.user}` !== req.user._id)
    return res.status(403).send("Forbidden");
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
    res.send("Deleted Succesfully");
  } catch (ex) {
    await session.abortTransaction();
    res.status(500).json({ error: "Can not delete the reply" });
  } finally {
    session.endSession();
  }
});
export default router;
