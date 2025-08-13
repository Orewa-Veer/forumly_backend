import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan"; // Missing import

import err from "../middleware/error.js";
import login from "../routes/auth.js";
import bookmark from "../routes/bookmark.js";
import discussion from "../routes/discussion.js";
import currentUser from "../routes/me.js";
import user from "../routes/register.js";
import replies from "../routes/replies.js";
import tag from "../routes/tags.js";
import upvote from "../routes/upvotes.js";
import logout from "../routes/logout.js";
import notific from "../routes/notifications.js";

export default function (app, io) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );

  // Attach socket.io instance to req
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  app.set("trust proxy", 1);

  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  // app.use(morgan("dev"));

  // Routes
  app.use("/api/register", user);
  app.use("/api/me", currentUser);
  app.use("/api/login", login);
  app.use("/api/logout", logout);
  app.use("/api/tags", tag);
  app.use("/api/replies", replies);
  app.use("/api/notification", notific);
  app.use("/api/discussion", discussion);
  app.use("/api/bookmark", bookmark);
  app.use("/api/upvote", upvote);

  // Error handler
  app.use(err);
}
