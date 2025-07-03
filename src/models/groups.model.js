import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    about: {
      type: String,
      default: "Hey you are using My Chat.",
    },
  },
  {
    timestamps: true,
  }
);
export const Group = mongoose.model("Group", groupSchema);
