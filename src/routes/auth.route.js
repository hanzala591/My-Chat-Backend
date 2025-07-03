import express from "express";
import {
  verifyOTPSignUp,
  signUp,
  signIn,
  forgetPassword,
  verifyOTPForgetPassword,
  getCurrentUser,
  generateOTPAgain,
  logout,
} from "../controllers/auth.controller.js";
import {
  signUpValidation,
  signInValidation,
  verifyOTPSigninValidation,
  forgetPasswordValidation,
  verifyOTPForgetPasswordValidation,
} from "../middlewares/Validation/authvalidation.middleware.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";
const authRouter = express.Router();
authRouter.post("/signUp", signUpValidation, signUp);
authRouter.post("/verifyOTPSignUp", verifyOTPSigninValidation, verifyOTPSignUp);
authRouter.post("/generateOTPAgain", generateOTPAgain);
authRouter.post("/signIn", signInValidation, signIn);
authRouter.post("/forgetPassword", forgetPasswordValidation, forgetPassword);
authRouter.post(
  "/verifyOTPForgetPassword",
  verifyOTPForgetPasswordValidation,
  verifyOTPForgetPassword
);
authRouter.get("/getCurrentUser", authenticatedUser, getCurrentUser);
authRouter.get("/logout", authenticatedUser, logout);
export default authRouter;
