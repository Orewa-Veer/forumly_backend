import express from "express";
import { Notification } from "../models/notifications.js";
import { Reply, replyValidate } from "../models/replies.js";
import { Discussion } from "../models/Discussion.js";
import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";
import auth from "../middleware/auth.js";
import { limiter } from "../middleware/limiter.js";
const router = express.Router();
router.get("/:id", async (req, res) => {
  const parentId = req.params.id;
  const discuss = await Discussion.findById(parentId);
  if (!discuss) return res.status(404).send("No such discussion found");
  const result = await Reply.find({ parentId: parentId }).populate("user");
  // console.log("req.io exists? ", !!req.io);
  res.json({ data: result });
});
router.post("/:id", [auth, limiter], async (req, res) => {
  const parentId = req.params.id;
  // console.log(parentId);
  // console.log(req.user._id);
  // console.log(req.body);
  const cleanReply = sanitizeHtml(req.body.body, {
    allowedTags: [
      "b",
      "i",
      "em",
      "strong",
      "u",
      "a",
      "ul",
      "ol",
      "li",
      "p",
      "br",
      "span",
      "blockquote",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      span: ["style"],
      "*": ["style"], // optional, only if you're allowing inline styles
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
  // return;
  const error = replyValidate(req.body);
  if (error)
    return res.status(400).json({ error: "There is a validation error" });
  const discuss = await Discussion.findById(parentId);
  if (!discuss)
    return res.status(404).json({ error: "No such discussion exists" });
  const reply = new Reply({
    user: req.user._id,
    parentId: parentId,
    body: cleanReply,
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
    const notifcArr = await Notification.create(
      [
        {
          userId: discuss.user,
          type: "reply",
          discussId: parentId,
          typeId: reply._id,
        },
      ],
      { session }
    );
    const notific = notifcArr[0];
    const newNotific = await Notification.findById(notific._id)
      .populate("discussId")
      .session(session);
    // console.log(newNotific);
    await session.commitTransaction();
    // console.log(discuss.user);
    req.io.emit("reply:updated", reply);
    req.io.to("questions:join").emit("discussions:updated", newDiscuss);
    // console.log("this is the notification user id", discuss.user);
    req.io.to(`room:${discuss.user}`).emit("notification:new", newNotific);
    return res.json({ data: reply });
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
    const deletedNotific = await Notification.findOneAndDelete({
      typeId: reqId,
    });
    await session.commitTransaction();
    // console.log(discuss);
    req.io.to(`room:${discuss.user}`).emit("notificDeleted", deletedNotific);
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
