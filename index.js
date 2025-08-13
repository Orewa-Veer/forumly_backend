// import "dotenv/config";
import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import logger from "./middleware/logger.js";
import { registerSocketHandlers } from "./sockets/handler.js";
import configureLogic from "./startup/configureLogic.js";
import connectDb from "./startup/Db.js";
import routes from "./startup/routes.js";
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
}
startServer();
