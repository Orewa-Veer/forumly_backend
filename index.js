// import "dotenv/config";
import dotenv from "dotenv";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app.js";
import "./instrument.js";
import logger from "./middleware/logger.js";
import { registerSocketHandlers } from "./sockets/handler.js";
import configureLogic from "./startup/configureLogic.js";
import connectDb from "./startup/Db.js";
import routes from "./startup/routes.js";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
//

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // allow your frontend dev origin
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
  const PORT = process.env.PORT || 10000;
  server.listen(PORT, () => {
    logger.info("Server listening on port " + PORT);
  });
  console.log(mongoose.connection.name); // DB name
  // console.log(await mongoose.connection.db.listCollections().toArray()); // list collections
}
startServer();
