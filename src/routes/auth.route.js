import express from "express";
import {
  verifyOTPSignIn,
  signUp,
  signIn,
  forgetPassword,
  verifyOTPForgetPassword,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import {
  signUpValidation,
  signInValidation,
  verifyOTPSigninValidation,
  forgetPasswordValidation,
  verifyOTPForgetPasswordValidation,
} from "../middlewares/Validation/authvalidation.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const authRouter = express.Router();
authRouter.post("/signUp", signUpValidation, signUp);
authRouter.post("/signIn", signInValidation, signIn);
authRouter.post("/verifyOTPSignIn", verifyOTPSigninValidation, verifyOTPSignIn);
authRouter.post("/forgetPassword", forgetPasswordValidation, forgetPassword);
authRouter.post(
  "/verifyOTPForgetPassword",
  verifyOTPForgetPasswordValidation,
  verifyOTPForgetPassword
);
authRouter.get("/getCurrentUser", authenticateUser, getCurrentUser);
export default authRouter;
