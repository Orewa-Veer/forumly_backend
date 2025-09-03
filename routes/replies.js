import express from "express";
import auth from "../middleware/auth.js";
import { limiter } from "../middleware/limiter.js";
import { getReplies, postReply, deleteReply } from "../controllers/replies.js";

const router = express.Router();

router.get("/:id", getReplies);

router.post("/:id", [auth, limiter], postReply);

router.delete("/:id", auth, deleteReply);

export default router;
