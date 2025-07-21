import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
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
      origin: "http://localhost:5173", // allow your frontend dev origin
      credentials: true, // if you send cookies or auth headers
    })
  );
  app.use((req, res, next) => {
    req.io = io;
    next();
  });
  app.use(express.json());
  app.use(cookieParser());

  // app.use(morgan());
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

  app.use(err);
}
