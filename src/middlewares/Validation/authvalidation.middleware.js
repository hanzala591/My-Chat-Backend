import Joi from "joi";
import ApiError from "../../lib/ApiError.js";

export const signUpValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(50).required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });
    const { error } = schema.validate(req.body);

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    res.status(error?.code).json({ ...error, message: error.message });
  }
};

export const signInValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    res.status(error?.code).json({ ...error, message: error.message });
  }
};

export const verifyOTPSigninValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      otp: Joi.number().min(6),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    res.status(error?.code || 400).json({ ...error, message: error.message });
  }
};

export const forgetPasswordValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    res.status(error?.code || 400).json({ ...error, message: error.message });
  }
};

export const verifyOTPForgetPasswordValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      otp: Joi.number().min(6),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    res.status(error?.code || 400).json({ ...error, message: error.message });
  }
};
