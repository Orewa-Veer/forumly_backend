import express from "express";
import { createUser } from "../controllers/register.js";

const router = express.Router();

router.post("/", createUser);

export default router;
