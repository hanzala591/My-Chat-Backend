import express from "express";
const authRouter = express.Router();
authRouter.get("/signup", (req, res) => {
  console.log("req");
  res.json("done");
});
export default authRouter;
