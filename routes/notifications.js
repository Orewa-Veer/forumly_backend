import express from "express";
import { Notification } from "../models/notifications.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.get("/", auth, async (req, res) => {
  const userId = req.user._id;
  const notific = await Notification.find({ userId: userId }).sort({
    date: -1,
  });
  return res.json(notific);
});
export default router;
