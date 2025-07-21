import express from "express";
const router = express.Router();
router.post("/", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out" });
});
export default router;
