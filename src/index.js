import express from "express";
import { config } from "dotenv";
const app = express();
config();

app.get("/", (req, res) => {
  res.send("Hello Worlddsaffds!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
