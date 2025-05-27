import emailValidator from "node-email-verifier";
import ApiError from "../lib/ApiError.js";
import ApiResponse from "../lib/ApiResponse.js";
import User from "../models/auth.model.js";
import bcrypt, { compareSync, hashSync } from "bcrypt";
import { generateRandom } from "../lib/generateRandom.js";
import { sendEmail } from "../lib/sendEmail.js";
import { generateToken } from "../lib/generateToken.js";
import { messages, timming } from "../constants/message.constant.js";
//  User Sign Up
export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      throw new ApiError(400, messages.USER_EXITED_ERROR);
    }
    const hashPassword = bcrypt.hashSync(password, 10);

    const createUser = await User.create({
      username,
      email,
      password: hashPassword,
    });
    if (!createUser || !hashPassword) {
      throw new ApiError(500, messages.SOME_THING_WENT_WRONG);
    }
    const user = {
      username: createUser.username,
      email: createUser.email,
    };
    res.status(200).json(new ApiResponse(200, user, messages.SIGN_UP_SUCCESS));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};

// User Sign In
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findedUser = await User.findOne({ email });
    if (!findedUser) {
      throw new ApiError(400, messages.USER_NOT_EXISTED_ERROR);
    }
    const correctPassword = compareSync(password, findedUser.password);
    if (!correctPassword) {
      throw new ApiError(400, messages.WRONG_PASSWORD_ERROR);
    }

    const code = generateRandom();
    await sendEmail(email, code);
    findedUser.isVerified = code;
    findedUser.save();
    setTimeout(() => {
      findedUser.isVerified = null;
      findedUser.save();
    }, timming.OPT_EXPIRY);
    res
      .status(200)
      .json(new ApiResponse(200, email, messages.OTP_SEND_SUCCESS));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};

//User Verify OTP For Sign In
export const verifyOTPSignIn = async (req, res) => {
  try {
    const { email, code } = req.body;
    const findedUser = await User.findOne({ email });

    if (!findedUser) {
      throw new ApiError(400, messages.USER_NOT_EXISTED_ERROR);
    }

    if (findedUser?.isVerified === null) {
      throw new ApiError(400, messages.OTP_EXPIRE_ERROR);
    }
    if (findedUser?.isVerified !== parseInt(code)) {
      throw new ApiError(400, messages.OTP_WRONG_ERROR);
    }
    const tokenuser = {
      _id: findedUser?._id,
      username: findedUser?.username,
      email: findedUser?.email,
      role: findedUser?.role,
    };
    const token = generateToken(tokenuser);

    res
      .status(200)
      .cookie("auth", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json(new ApiResponse(200, tokenuser, messages.SIGN_IN_SUCCESS));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};

// User Forget Password
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findedUser = await User.findOne({ email });

    if (!findedUser) {
      throw new ApiError(400, messages.USER_NOT_EXISTED_ERROR);
    }
    const code = generateRandom();
    await sendEmail(email, code);
    findedUser.isVerified = code;
    findedUser.save();
    setTimeout(() => {
      findedUser.isVerified = null;
      findedUser.save();
    }, timming.OPT_EXPIRY);
    res.json(new ApiResponse(200, email, messages.OTP_SEND_SUCCESS));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};

// Verify OTP For Forget Password
export const verifyOTPForgetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    const findedUser = await User.findOne({ email });
    if (!findedUser) {
      throw new ApiError(400, messages.USER_NOT_EXISTED_ERROR);
    }
    if (findedUser?.isVerified === null) {
      throw new ApiError(400, messages.OTP_EXPIRE_ERROR);
    }
    if (findedUser?.isVerified !== parseInt(code)) {
      throw new ApiError(400, messages.OTP_WRONG_ERROR);
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    findedUser.password = hashPassword;
    findedUser.save();
    const user = {
      _id: findedUser?._id,
      username: findedUser?.username,
      email: findedUser?.email,
      role: findedUser?.role,
    };
    res
      .status(200)
      .json(new ApiResponse(200, user, messages.CHANGE_PASWORD_SUCCESS));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // if (!req?.user) {
    //   throw new ApiError(401, messages.NOT_SIGN_IN);
    // }
    res.status(200).json(new ApiResponse(200, req?.user));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};
