import express from "express";
const router = express.Router();
router.get("/", auth, async (req, res) => {});
export default router;
