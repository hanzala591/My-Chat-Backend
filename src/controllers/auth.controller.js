import emailValidator from "node-email-verifier";
import ApiError from "../lib/ApiError.js";
import ApiResponse from "../lib/ApiResponse.js";
import Auth from "../models/auth.model.js";
import bcrypt from "bcrypt";

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
      console.log(existsUser);
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

// User Sign Up
export const signin = async (req, res) => {};
