import User from "../models/user.model.js";
import ApiResponse from "../lib/ApiResponse.js";
export const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find({
      role: { $ne: "admin" },
      _id: { $ne: req?.user?._id },
    }).select("-password -role -isVerified -createdAt -updatedAt -__v");
    res.status(200).json(new ApiResponse(200, allUser));
  } catch (error) {
    console.log(error);
  }
};
