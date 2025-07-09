import express from "express";
import config from "config";
import jwt from "jsonwebtoken";
const router = express.Router();
router.get("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access Denied. No token provided");
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    res.json(decoded);
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
});
export default router;
