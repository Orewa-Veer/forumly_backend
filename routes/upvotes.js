import express from "express";
import { Discussion } from "../models/Discussion";
const router = express.Router();
router.post("/:id", auth, async (req, res) => {
  const discussId = req.params.id;
  const discuss = await Discussion.findById(discussId);
  const index = discuss.upvotes.find((up) => up.user_id === req.user._id);
  if (index) discuss.upvotes.
});
