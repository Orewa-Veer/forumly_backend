import express from "express";
import { deleteDiscussion, getAllDiscussions, postDiscussion } from "../controllers/discussion.js";
import auth from "../middleware/auth.js";
import { limiter } from "../middleware/limiter.js";
import { upload } from "../middleware/upload.js";
import { Discussion } from "../models/discussion.js";

const router = express.Router();

router.get("/", auth, getAllDiscussions);

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Discussion.findById(id).populate('user', 'name -_id');
  res.json(result);
});

router.post("/", [auth, limiter], upload.single("image"), postDiscussion);

router.delete("/:id", auth, deleteDiscussion);

export default router;
