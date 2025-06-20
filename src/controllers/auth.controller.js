import emailValidator from "node-email-verifier";
import ApiError from "../lib/ApiError.js";
import ApiResponse from "../lib/ApiResponse.js";
import User from "../models/user.model.js";
import bcrypt, { compareSync, hashSync } from "bcrypt";
import { generateRandom } from "../lib/generateRandom.js";
import { sendEmail } from "../lib/sendEmail.js";
import { generateToken } from "../lib/generateToken.js";
import { messages, timming } from "../constants/message.constant.js";
// User Sign Up
export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      throw new ApiError(400, messages.USER_EXITED_ERROR);
    }
    const hashPassword = bcrypt.hashSync(password, 10);

    const otp = generateRandom();
    await sendEmail(email, otp);

    const createUser = await User.create({
      username,
      email,
      password: hashPassword,
      otp: otp,
    });
    if (!createUser || !hashPassword) {
      throw new ApiError(500, messages.SOME_THING_WENT_WRONG);
    }
    const user = {
      username: createUser.username,
      email: createUser.email,
    };
    res.status(200).json(new ApiResponse(200, user, messages.OTP_SEND_SUCCESS));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};

// OTP Verification After Sign Up
export const verifyOTPSignUp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const findedUser = await User.findOne({ email });

    if (!findedUser) {
      throw new ApiError(400, messages.USER_NOT_EXISTED_ERROR);
    }

    const otpSavedTime = findedUser.updatedAt.getTime();
    const currentTime = new Date().getTime();
    const isOTPExpired = currentTime - otpSavedTime;

    if (isOTPExpired > timming.OPT_EXPIRY) {
      throw new ApiError(400, messages.OTP_EXPIRE_ERROR);
    }

    if (findedUser?.otp !== parseInt(otp)) {
      throw new ApiError(400, messages.OTP_WRONG_ERROR);
    }

    findedUser.isVerified = true;
    findedUser.save();
    const payloadObj = {
      _id: findedUser._id,
      username: findedUser.username,
      email: findedUser.email,
      role: findedUser.role,
    };

    const payload = generateToken(payloadObj);

    res
      .status(200)
      .cookie("auth", payload, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json(new ApiResponse(200, payloadObj, messages.SIGN_IN_SUCCESS));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};

// Generate OTP Again
export const generateOTPAgain = async (req, res) => {
  try {
    const { email } = req.body;
    const isExistUser = await User.findOne({ email });
    if (!isExistUser) {
      throw new ApiError(400, messages.USER_NOT_EXISTED_ERROR);
    }

    const otp = generateRandom();
    await sendEmail(email, otp);

    isExistUser.otp = otp;
    isExistUser.save();

    res.status(200).json(new ApiResponse(200, messages.OTP_SEND_SUCCESS));

    // res
    //   .status(200)
    //   .cookie("auth", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //   })
    //   .json(new ApiResponse(200, tokenuser, messages.SIGN_IN_SUCCESS));
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

    if (findedUser?.isVerified === false) {
      throw new ApiError(400, messages.NOT_VERIFIED_EMAIL);
    }

    const payloadObj = {
      _id: findedUser._id,
      username: findedUser.username,
      email: findedUser.email,
      role: findedUser.role,
    };

    const payload = generateToken(payloadObj);
    res
      .status(200)
      .cookie("auth", payload, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json(new ApiResponse(200, payloadObj, messages.SIGN_IN_SUCCESS));
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
    const otp = generateRandom();
    await sendEmail(email, otp);
    findedUser.otp = otp;
    findedUser.save();
    res.json(new ApiResponse(200, email, messages.OTP_SEND_SUCCESS));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};

// Verify OTP For Forget Password
export const verifyOTPForgetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const findedUser = await User.findOne({ email });
    if (!findedUser) {
      throw new ApiError(400, messages.USER_NOT_EXISTED_ERROR);
    }
    const otpUpdatedTime = findedUser.updatedAt.getTime();
    const currentTime = new Date().getTime();
    const isOTPExpiredTime = currentTime - otpUpdatedTime;
    if (isOTPExpiredTime > timming.OPT_EXPIRY) {
      throw new ApiError(400, messages.OTP_EXPIRE_ERROR);
    }

    if (findedUser?.otp !== parseInt(otp)) {
      throw new ApiError(400, messages.OTP_WRONG_ERROR);
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    findedUser.password = hashPassword;
    findedUser.save();

    res.status(200).json(new ApiResponse(200, messages.CHANGE_PASWORD_SUCCESS));
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

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("auth")
      .json(new ApiResponse(200, messages.LOGOUT));
  } catch (error) {
    res.status(error.code || 400).json({ ...error, message: error.message });
  }
};
