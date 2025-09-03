import express from "express";
import { postCred } from "../controllers/auth.js";

const router = express.Router();

router.post("/", postCred);



export default router;
