import express from "express";
import {
  changepassword,
  generateOTP,
  signin,
  signup,
} from "../controllers/auth.controller.js";
const authRouter = express.Router();
authRouter.post("/signup", signup);
authRouter.post("/generateOTP", generateOTP);
authRouter.post("/signin", signin);
authRouter.post("/changepassword", changepassword);
export default authRouter;
