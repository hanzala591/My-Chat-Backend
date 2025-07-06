import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  socket.on("register", (userid, callback) => {
    const room = io.sockets.adapter.rooms.get(userid);
    if (room && room.size > 0) {
      callback(`You are Already Connected. ${userid}`);
    } else {
      socket.join(userid);
      callback(`You are Connected. ${userid}`);
    }
  });
  socket.on("join-group", (groupId, userId) => {
    socket.join(groupId);
  });
});

export { app, server, io };
