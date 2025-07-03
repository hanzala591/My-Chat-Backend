import { messages } from "../constants/message.constant.js";
import ApiResponse from "../lib/ApiResponse.js";
import { Group } from "../models/groups.model.js";

export const createGroup = async (req, res, next) => {
  try {
    const { name } = req.body;
    let { members: groupmembers } = req.body;
    const { user: admin } = req;
    groupmembers = [...groupmembers, admin._id];
    const newGroup = await Group.create({
      name,
      members: groupmembers,
      admin: admin._id,
    });

    if (!newGroup) {
      throw new ApiError(500, messages.SOME_THING_WENT_WRONG);
    }
    const response = await Group.findOne({
      _id: newGroup._id,
    }).select("name members admin about");
    res
      .status(201)
      .json(new ApiResponse("201", response, messages.GROUP_CREATED));
  } catch (error) {
    next(error);
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const { user } = req;
    const groups = await Group.find({
      members: { $in: [user._id] },
    }).select("_id name admin members about");
    res
      .status(200)
      .json(new ApiResponse("201", groups, messages.GROUP_CREATED));
  } catch (error) {
    next(error);
  }
};
