import { Server } from "socket.io"
import express from "express"
import http from "http"

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.URL],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // For storing userId that is associated to socketId

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected to socket id ${socket.id}`);
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap)); 

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  })
})

export { app, server, io }

export const getRecieverSocketId = (recieverId) => userSocketMap[recieverId];