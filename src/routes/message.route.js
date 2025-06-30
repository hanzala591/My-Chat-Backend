import express from "express";
import {
  getAllAdminMessages,
  getAllChatMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  getAllMessagesValidation,
  sendMassageValidation,
} from "../middlewares/Validation/messageValidation.middleware.js";
import { upload } from "../lib/multer.js";
const messageRouter = express.Router();
messageRouter.post(
  "/sendmessage/:id",
  authenticateUser,
  upload.single("media"),
  sendMassageValidation,
  sendMessage
);
messageRouter.get(
  "/getAllChatMessages/:id",
  authenticateUser,
  getAllMessagesValidation,
  getAllChatMessages
);

messageRouter.get(
  "/getAllAdminMessages",
  authenticateUser,
  getAllAdminMessages
);
export default messageRouter;
