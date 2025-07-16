import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import configureLogic from "./startup/configureLogic.js";
import connectDb from "./startup/Db.js";
import logger from "./middleware/logger.js";
import routes from "./startup/routes.js";
import { registerSocketHandlers } from "./sockets/handler.js";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // allow your frontend dev origin
    methods: ["GET", "POST"],
    credentials: true, // if you send cookies or auth headers
  },
});

configureLogic();
//middleware

app.get("/", (req, res) => {
  res.send("API is working!");
});
routes(app, io);
// server listening
async function startServer() {
  await connectDb();
  registerSocketHandlers(io);
  server.listen(3000, () => {
    logger.info("Server listening on port 3000");
  });
}
startServer();
