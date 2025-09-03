import express from "express";
import auth from "../middleware/auth.js";
import { limiter } from "../middleware/limiter.js";
import { getUpvotedDiscussion, postUpvote } from "../controllers/upvotes.js";

const router = express.Router();

router.get("/", auth, getUpvotedDiscussion);

router.post("/:id", [auth, limiter], postUpvote);

export default router;
