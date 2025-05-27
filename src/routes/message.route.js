import express from "express";
import {
  getAllAdminMessages,
  getAllMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  getAllMessagesValidation,
  sendMassageValidation,
} from "../middlewares/Validation/messageValidation.middleware.js";
const messageRouter = express.Router();
messageRouter.post(
  "/sendmessage/:id",
  authenticateUser,
  sendMassageValidation,
  sendMessage
);
messageRouter.get(
  "/getAllMessages/:id",
  authenticateUser,
  getAllMessagesValidation,
  getAllMessages
);

messageRouter.get(
  "/getAllAdminMessages",
  authenticateUser,
  getAllAdminMessages
);
export default messageRouter;
