import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import { Notification } from "../models/notifications.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user._id;
  const {
    sort = "date",
    order = "des",
    page = 1,
    limit = 10,
    ...filters
  } = req.query;
  const sortOrder = order === "asc" ? 1 : -1;
  const pageNo = Math.max(1, parseInt(page));
  const pageLim = Math.min(Math.max(10, parseInt(limit)), 100);
  const filter = {};
  if (filters.type && (filters.type === "upvote" || filters.type === "reply")) {
    filter.type = filters.type;
  }
  if (filters.seen) {
    if (filters.seen === "true") filter.seen = true;
    else {
      filter.seen = false;
    }
  }
  const notific = await Notification.find({ userId: userId, ...filter })
    .sort({
      [sort]: sortOrder,
    })
    .skip((pageNo - 1) * pageLim)
    .limit(pageLim)
    .populate({ path: "discussId", select: "title" });

  return res.json({ data: notific });
});

router.post("/mark-all-seen", auth, async (req, res) => {
  const nofitic = await Notification.updateMany(
    { userId: req.user._id, seen: false },
    { $set: { seen: true } }
  );
  req.io.to(`room:${req.user._id}`).emit("allNotification:seen");
  return res.json({ status: "seen" });
});

router.post("/:id", auth, async (req, res) => {
  const notificId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(notificId))
    return res.status(400).json({ error: "Not a valid notification Id" });
  const notific = await Notification.findById(notificId);
  if (!notific)
    return res.status(404).json({ error: "No such notification found" });
  if (notific.userId.toString() !== req.user._id)
    return res.status(403).json({ error: "Unauthorized" });
  await Notification.updateOne({ _id: notific._id }, { $set: { seen: true } });
  return res.json({ status: "seen" });
});

export default router;
