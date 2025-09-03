import express from "express";
import { getAllBookmarks, postBookmark } from "../controllers/bookmarks.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getAllBookmarks);

router.post("/:id", auth, postBookmark);

export default router;
