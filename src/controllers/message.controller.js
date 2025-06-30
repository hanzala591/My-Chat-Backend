import { detectAbuse } from "abuse-detection";
import ApiError from "../lib/ApiError.js";
import { messages } from "../constants/message.constant.js";
import ApiResponse from "../lib/ApiResponse.js";
import Message from "../models/message.model.js";
import { io } from "../lib/socket.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

export const sendMessage = async (req, res) => {
  try {
    const { _id: senderId } = req.user;
    const { id: receiverId } = req.params;
    const { text = null } = req.body;
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
      receiverId,
      text: text,
      fileType: fileType,
      fileUrl: uploadedFile?.secure_url,
      fileName: file?.originalname,
    };

    const detectedMessage = detectAbuse(text || "");
    if (detectedMessage.hasAbusiveWords === true) {
      const admin = await User.findOne({ role: "admin" });
      messageObj.receiverId = admin._id;
      io.to(admin._id.toString()).emit("newmessage", messageObj);
    } else {
      io.to(receiverId.toString()).emit("newmessage", messageObj);
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
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || "Server Error" });
    }
  }
};

export const getAllChatMessages = async (req, res) => {
  try {
    const { user: senderId } = req;
    const { id: receiverId } = req.params;
    const messages = await Message.find({
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
