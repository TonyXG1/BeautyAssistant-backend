import { Server } from "socket.io";

export const initializeChat = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const messages = [];
  const users = {};

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.emit("previousMessages", messages);
    
    socket.on("registerUser", (username) => {
      users[socket.id] = username;
      console.log(`User registered: ${username} (Socket ID: ${socket.id})`);

      io.emit("userConnected", {
        message: `${username} се присъедини към чата!`,
        username,
      });
    });

    socket.emit("previousMessages", messages);

    socket.on("sendMessage", (message) => {
      console.log("Message received:", message);

      messages.push(message);

      io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      const username = users[socket.id];
      console.log("A user disconnected:", socket.id);

      io.emit("userDisconnected", {
        message: `${username} напусна чата.`,
        username,
      });
      delete users[socket.id];
    });
  });

  server.listen(3005);
};
