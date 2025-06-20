import { detectAbuse } from "abuse-detection";
import ApiError from "../lib/ApiError.js";
import { messages } from "../constants/message.constant.js";
import ApiResponse from "../lib/ApiResponse.js";
import Message from "../models/message.model.js";
import { io } from "../lib/socket.js";
import User from "../models/user.model.js";
export const sendMessage = async (req, res) => {
  try {
    const { _id: senderId } = req.user;
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const messageObj = {
      senderId,
      receiverId,
      message,
    };

    const detectedMessage = detectAbuse(message);
    if (detectedMessage.hasAbusiveWords === true) {
      const admin = await User.findOne({ role: "admin" });
      messageObj.receiverId = admin._id;
      io.to(admin._id.toString()).emit("newmessage", messageObj);
    } else {
      io.to(receiverId).emit("newmessage", messageObj);
    }

    const messageSave = await Message.create(messageObj);
    if (!messageSave) {
      throw new ApiError(400, message.SOME_THING_WENT_WRONG);
    }
    const response = {
      senderId: messageSave?.senderId,
      receiverId: messageSave?.receiverId,
      message: messageSave?.message,
    };
    res
      .status(200)
      .json(new ApiResponse(200, response, messages.SEND_MESSAGE_SUCCESSFULL));
  } catch (error) {
    res.status(error?.code || 400).json({ ...error, error: error?.message });
  }
};

export const getAllMessages = async (req, res) => {
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
