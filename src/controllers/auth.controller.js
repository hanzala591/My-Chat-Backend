import emailValidator from "node-email-verifier";
import ApiError from "../lib/ApiError.js";
import ApiResponse from "../lib/ApiResponse.js";
import Auth from "../models/auth.model.js";
import bcrypt, { compareSync, hashSync } from "bcrypt";
import { generateRandom } from "../lib/RandomNumber.js";
import { sendEmail } from "../lib/NodeMailer.js";
import { generateToken } from "../lib/GenerateToken.js";
//  User Sign Up
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username) {
      throw new ApiError(400, "Username is required.");
    }
    if (!email) {
      throw new ApiError(400, "Email is required.");
    } else {
      const validEmail = await emailValidator(email);
      if (!validEmail) {
        throw new ApiError(400, "Please Enter the Valid Email.");
      }
    }
    if (!password) {
      throw new ApiError(400, "Password is required.");
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    if (!hashPassword) {
      throw new ApiError(400, "Password is not Hashed");
    }
    const existsUser = await Auth.findOne({ email });
    if (existsUser) {
      throw new ApiError(400, "User Is Already Existed");
    }
    const createUser = await Auth.create({
      username,
      email,
      password: hashPassword,
    });
    if (!createUser) {
      throw new ApiError(500, "User is not Created.");
    }
    const user = {
      username: createUser.username,
      email: createUser.email,
    };
    res.status(200).json(new ApiResponse(200, user));
  } catch (error) {
    res.json({ ...error, message: error.message });
  }
};

// User generate OTP
export const generateOTP = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new ApiError(400, "Email is required.");
    } else {
      const validEmail = await emailValidator(email);
      if (!validEmail) {
        throw new ApiError(400, "Please Enter the Valid Email.");
      }
    }
    if (!password) {
      throw new ApiError(400, "Password is required.");
    }
    const findedUser = await Auth.findOne({ email });
    if (!findedUser) {
      throw new ApiError(400, "User is not Existed.");
    }
    const correctPassword = compareSync(password, findedUser.password);
    if (!correctPassword) {
      throw new ApiError(400, "Wrong Password.");
    }

    const code = generateRandom();
    await sendEmail(email, code);
    findedUser.isVerified = code;
    findedUser.save();
    console.log(findedUser);
    res.status(200).json(new ApiResponse(200, email));
  } catch (error) {
    res.json({ ...error, message: error.message });
  }
};

//User Sign In
export const signin = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!code) {
      throw new ApiError(400, "Please Enter the Code.");
    }
    if (code.length < 6) {
      throw new ApiError(400, " Enter 6 Digit Code.");
    }
    if (!email) {
      throw new ApiError(400, "Email Went Wrong");
    }
    const findedUser = await Auth.findOne({ email });
    if (findedUser.isVerified !== parseInt(code)) {
      throw new ApiError(400, "You Enter Wrong Code.");
    }
    const tokenuser = {
      username: findedUser.username,
      email: findedUser.email,
      role: findedUser.role,
    };
    const token = generateToken(tokenuser);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json(new ApiResponse(200, "You Are Signin"));
  } catch (error) {
    res.json({ ...error, message: error.message });
  }
};

export const changepassword = async (req, res) => {
  try {
    const { email, prepassword, newpassword } = req.body;
    if (!email) {
      throw new ApiError(400, "Email is required.");
    } else {
      const validEmail = await emailValidator(email);
      if (!validEmail) {
        throw new ApiError(400, "Please Enter the Valid Email.");
      }
    }
    if (!prepassword) {
      throw new ApiError(400, "Previous Password is required");
    }
    if (!newpassword) {
      throw new ApiError(400, "New Password is required.");
    }

    const findedUser = await Auth.findOne({ email });
    const correctPassword = compareSync(prepassword, findedUser.password);
    if (!correctPassword) {
      throw new ApiError(400, "Enter Wrong Previous Password.");
    }

    const hashPassword = bcrypt.hashSync(newpassword, 10);
    if (!hashPassword) {
      throw new ApiError(400, "Password is not Hashed");
    }
    findedUser.password = hashPassword;
    findedUser.save();
    res.json(new ApiResponse(200, "Password Change Successfully."));
  } catch (error) {
    res.json({ ...error, message: error.message });
  }
};
