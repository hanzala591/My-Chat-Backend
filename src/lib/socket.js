import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:5173"],
    origin: "*", // Allow all origins for development. In production, specify your frontend URL.
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  socket.on("register", (userid) => {
    socket.join(userid);
    io.to(userid).emit("registered", `You are Connected. ${userid}`);
  });
});

export { app, server, io };
