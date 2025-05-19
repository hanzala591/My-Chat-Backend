import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();
export const generateToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_KEY);
  return token;
};
