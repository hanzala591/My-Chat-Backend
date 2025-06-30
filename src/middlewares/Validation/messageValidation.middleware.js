import Joi from "joi";
import ApiError from "../../lib/ApiError.js";
export const sendMassageValidation = async (req, res, next) => {
  try {
    console.log(req?.body?.text);
    console.log(req?.file?.path);
    const schema = Joi.object({
      text: Joi.string().allow("").min(2),
      fileUrl: Joi.string().allow("").min(2),
      user: Joi.required(),
      id: Joi.required(),
    }).or("text", "fileUrl");

    const { error } = schema.validate({
      text: req?.body?.text,
      fileUrl: req?.file?.path,
      user: req?.user,
      id: req?.params?.id,
    });
    if (error) {
      console.log(error);
      throw new ApiError(403, error.details[0].message);
    }
  } catch (error) {
    console.log(error);
    res.status(error?.code || 411).json({ ...error, message: error.message });
  }
  next();
};

export const getAllMessagesValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      user: Joi.required(),
      id: Joi.required(),
    });

    const { error } = schema.validate({
      user: req?.user,
      id: req?.params?.id,
    });
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
  } catch (error) {
    res.status(error?.code || 400).json({ ...error, message: error.message });
  }
  next();
};
