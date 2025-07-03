import jwt from "jsonwebtoken";
import ApiError from "../lib/ApiError.js";
import { messages } from "../constants/message.constant.js";
export const authenticatedUser = async (req, res, next) => {
  try {
    const token = req?.cookies?.auth;
    if (token) {
      const user = jwt.verify(token, process.env.JWT_KEY);
      req.user = user;
      next();
    } else {
      throw new ApiError(401, messages.NOT_SIGN_IN);
    }
  } catch (error) {
    console.error(error.code);
    next(error);
  }
};
