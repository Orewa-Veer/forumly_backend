import express from "express";
import { getNotifications, markAllSeen, markOneSeen } from "../controllers/notifications.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getNotifications);

router.post("/mark-all-seen", auth, markAllSeen);

router.post("/:id", auth, markOneSeen);

export default router;
