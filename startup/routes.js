import * as Sentry from "@sentry/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import err from "../middleware/error.js";
import login from "../routes/auth.js";
import bookmark from "../routes/bookmark.js";
import discussion from "../routes/discussion.js";
import logout from "../routes/logout.js";
import currentUser from "../routes/me.js";
import notific from "../routes/notifications.js";
import user from "../routes/register.js";
import replies from "../routes/replies.js";
import tag from "../routes/tags.js";
import upvote from "../routes/upvotes.js";

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
  app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
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
  Sentry.setupExpressErrorHandler(app);
  // Error handler
  app.use(err);
}
