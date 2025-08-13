export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    // console.log("New Socket: ", socket.id);
    const userId = socket.handshake.auth.userId;
    if (userId) {
      socket.join(`room:${userId}`);
      console.log(`User ${userId} connected and joined room`);
    } else {
      console.log("No userId in handshake. Connection rejected.");
      socket.disconnect();
    }
    socket.on("questions:join", () => {
      socket.join("questions:join");
      console.log("questions joined");
    });
    socket.on("questions:disconnected", () => {
      socket.leave("questions:join");
    });
    socket.on("discussion:join", (discussionId) => {
      console.log("This is the discussion id", discussionId);
      socket.join(`discussion:${discussionId}`);
      console.log(`Socket ${socket.id} joined room discussion:${discussionId}`);
    });
    socket.on("discussion:leave", (discussionId) => {
      socket.leave(`discussion:${discussionId}`);
      console.log("socket disconnected ", socket.id);
    });
    socket.on("disconnect", (reason) => {
      // console.log("Socket disconnected :", reason);
    });
  });
}
