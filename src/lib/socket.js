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
    console.log(Array.from(socket));
    socket.join(userid);
    callback(`You are Connected. ${userid}`);
  });
  socket.on("join-group", (groupid, callback) => {});
});

export { app, server, io };
