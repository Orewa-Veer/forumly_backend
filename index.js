import express from "express";
import mongoose from "mongoose";
import discussion from "./routes/discussion.js";
import tag from "./routes/tags.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import user from "./routes/register.js";
import config from "config";
import morgan from "morgan";
import login from "./routes/auth.js";
import logger from "./middleware/logger.js";
import currentUser from "./routes/me.js";
import err from "./middleware/error.js";
import replies from "./routes/replies.js";
import upvote from "./routes/upvotes.js";
mongoose
  .connect("mongodb://localhost/formuly")
  .then(() => logger.info("Connected to MongoDB"));
const app = express();
if (!config.get("jwtPrivateKey")) throw new Error("Fatal Error");
//middleware
app.use(
  cors({
    origin: "http://localhost:5173", // allow your frontend dev origin
    credentials: true, // if you send cookies or auth headers
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use(morgan());
app.use("/api/register", user);
app.use("/api/me", currentUser);
app.use("/api/login", login);
app.use("/api/tags", tag);
app.use("/api/replies", replies);
app.use("/api/discussion", discussion);
app.use("/api/upvote", upvote);
app.use(err);

// server listening
app.listen(3000, () => {
  logger.info("Loading the server");
});
