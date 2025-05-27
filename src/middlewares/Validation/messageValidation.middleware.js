import Joi from "joi";
import ApiError from "../../lib/ApiError.js";
export const sendMassageValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      message: Joi.string().min(1).required(),
      user: Joi.required(),
      id: Joi.required(),
    });

    const { error } = schema.validate({
      message: req.body.message,
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
