import mongoose from "mongoose";
const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then((res) => {});
  } catch (error) {
    throw new error();
  }
};
export default connectionDB;
