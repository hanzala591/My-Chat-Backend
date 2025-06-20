import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();
export const generateToken = (payloadObj) => {
  const payload = jwt.sign(payloadObj, process.env.JWT_KEY);
  return payload;
};
