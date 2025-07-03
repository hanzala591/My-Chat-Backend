import express from "express";
import {
  getAllAdminMessages,
  getAllChatMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";
import {
  getAllMessagesValidation,
  sendMassageValidation,
} from "../middlewares/Validation/messageValidation.middleware.js";
import { upload } from "../lib/multer.js";
const messageRouter = express.Router();
messageRouter.post(
  "/sendmessage/:id",
  authenticatedUser,
  upload.single("media"),
  sendMassageValidation,
  sendMessage
);
messageRouter.get(
  "/getAllChatMessages/:id",
  authenticatedUser,
  getAllMessagesValidation,
  getAllChatMessages
);

messageRouter.get(
  "/getAllAdminMessages",
  authenticatedUser,
  getAllAdminMessages
);
export default messageRouter;
