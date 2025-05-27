import jwt from "jsonwebtoken";
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req?.cookies?.auth;
    if (token) {
      const user = jwt.verify(token, process.env.JWT_KEY);
      req.user = user;
    }
  } catch (error) {
    next(error);
  }
  next();
};
