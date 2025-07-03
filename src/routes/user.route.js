import express from "express";
import { getAllUser } from "../controllers/user.controller.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";
const userRouter = express.Router();
userRouter.get("/getAllUser", authenticatedUser, getAllUser);
export default userRouter;
