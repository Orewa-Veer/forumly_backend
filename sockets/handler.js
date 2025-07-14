export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("New Socket: ", socket.id);
    socket.on("questions:join", () => {
      socket.join("questions:join");
    });
    socket.on("questions:disconnected", () => {
      socket.leave("questions:join");
    });
    socket.on("discussion:join", (discussionId) => {
      socket.join(`discussion:${discussionId}`);
      console.log(`Socket ${socket.id} joined room discussion:${discussionId}`);
    });
    socket.on("discussion:leave", (discussionId) => {
      socket.leave(`discussion:${discussionId}`);
      console.log("socket disconnected ", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected :", socket.id);
    });
  });
}
