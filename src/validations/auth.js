import { Joi } from "express-validation";

export const signup = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
    mobile: Joi.number().required(),
  }),
}

export const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}


export const forgotPassword = {
  body: Joi.object({
      email: Joi.string().email().required().messages({
          'string.base': 'Email should be a type of string',
          'string.empty': 'Email cannot be an empty field',
          'any.required': 'Email is a required field',
      }),
  }),
};

export const resetPassword = {
  body: Joi.object({
      password: Joi.string().min(6).required().messages({
          'string.base': 'Password should be a type of string',
          'string.empty': 'Password cannot be an empty field',
          'any.required': 'Password is a required field',
      }),
  }),
};
