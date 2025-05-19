import express from "express";
import { config } from "dotenv";
import connectionDB from "./db/connectionDB.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
const app = express();
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

connectionDB().then(() => {
  console.log("Mongo Db is Connected.");
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.port}`);
  });
});
