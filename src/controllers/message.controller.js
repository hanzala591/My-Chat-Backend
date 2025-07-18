import { detectAbuse } from "abuse-detection";
import ApiError from "../lib/ApiError.js";
import { messages } from "../constants/message.constant.js";
import ApiResponse from "../lib/ApiResponse.js";
import Message from "../models/message.model.js";
import { io } from "../lib/socket.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

export const sendMessage = async (req, res, next) => {
  try {
    const { _id: senderId } = req.user;
    const { text = null } = req.body;
    const { chatType } = req.query;
    let receiverId = null;
    if (chatType === "user") {
      receiverId = req.params.id;
    } else {
      receiverId = req.params.id;
    }
    const { file = null } = req;
    let uploadedFile = null;
    let fileType = null;
    if (file) {
      uploadedFile = await cloudinary.uploader.upload(file?.path, {
        folder: "my_chat",
      });
      fileType = file?.mimetype;
      fs.unlinkSync(file?.path);
    }

    const messageObj = {
      senderId,
      receiverId: chatType === "user" ? receiverId : null,
      text: text,
      receiverGroup: chatType === "group" ? receiverId : null,
      chatType: chatType,
      fileType: fileType,
      fileUrl: uploadedFile?.secure_url || null,
      fileName: file?.originalname || null,
    };

    const detectedMessage = detectAbuse(text || "");
    if (detectedMessage.hasAbusiveWords === true) {
      const admin = await User.findOne({ role: "admin" });
      messageObj.receiverId = admin._id;
      const senderUser = await User.findOne({ _id: senderId }).select(
        "username email"
      );
      messageObj.senderId = senderUser;
      io.to(admin._id.toString()).emit("adminMessage", messageObj);
      messageObj.senderId = senderId;
    } else {
      if (chatType === "group") {
        const room = io?.sockets?.adapter?.rooms?.get(receiverId);
        const senderRoom = io?.sockets?.adapter?.rooms?.get(senderId);
        const senderSocket = Array.from(senderRoom)[0];
        for (const value of room) {
          if (value !== senderSocket) {
            io.to(value).emit("newmessage", messageObj);
          }
        }
      } else {
        io.to(receiverId.toString()).emit("newmessage", messageObj);
      }
    }
    const messageSave = await Message.create(messageObj);
    if (!messageSave) {
      throw new ApiError(403, messages.SOME_THING_WENT_WRONG);
    }
    const response = {
      senderId: messageSave?.senderId,
      receiverId: messageSave?.receiverId,
      text: messageSave?.text,
      fileType: messageSave?.fileType,
      fileUrl: messageSave?.fileUrl,
      fileName: messageSave?.fileName,
    };
    res
      .status(200)
      .json(new ApiResponse(200, response, messages.SEND_MESSAGE_SUCCESSFULL));
  } catch (error) {
    next(error);
  }
};

export const getAllChatMessages = async (req, res) => {
  try {
    const { user: senderId } = req;
    const { id: receiverId } = req.params;
    const { chatType } = req.query;

    let messages = [];
    if (chatType === "user") {
      messages = await Message.find({
        $or: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      }).select("-_id -createdAt -updatedAt -__v");
    }
    if (chatType === "group") {
      messages = await Message.find({ receiverGroup: receiverId }).select(
        "-_id -createdAt -updatedAt -__v"
      );
    }
    res.status(200).json(new ApiResponse(200, messages));
  } catch (error) {
    res.status(error?.code || 400).json({ ...error, error: error?.message });
  }
};

export const getAllAdminMessages = async (req, res) => {
  try {
    const { user } = req;
    const messages = await Message.find({ receiverId: user._id })
      .select("-createdAt -updatedAt -__v")
      .populate("senderId", "username");
    res.status(200).json(new ApiResponse(200, messages));
  } catch (error) {
    res.status(error?.code || 400).json({ ...error, error: error?.message });
  }
};
