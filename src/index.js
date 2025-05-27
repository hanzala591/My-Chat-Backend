import express from "express";
import { config } from "dotenv";
import connectionDB from "./db/connectionDB.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import userRouter from "./routes/user.route.js";
config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/users", userRouter);
connectionDB().then(() => {
  console.log("Mongo Db is Connected.");
  server.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.port}`);
  });
});
