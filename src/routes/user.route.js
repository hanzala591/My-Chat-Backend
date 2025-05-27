import express from "express";
import { getAllUser } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const userRouter = express.Router();
userRouter.get("/getAllUser", authenticateUser, getAllUser);
export default userRouter;
