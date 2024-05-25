import Joi from "joi";

export const authSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().trim().required(),
  subscription: Joi.string(),
  token: Joi.string().token(),
  // avatarURL: Joi.string().required(),
  avatarURL: Joi.string(),
});

export const authLogSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().trim().required(),
  subscription: Joi.string(),
  token: Joi.string().token(),
  // avatarURL: Joi.string().required(),
  avatarURL: Joi.string(),
  verify: Joi.boolean(),
  verificationToken: Joi.string(),
});


 