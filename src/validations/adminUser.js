import { Joi } from "express-validation";
import JoiObjectId from "joi-objectid";
Joi.objectId = JoiObjectId(Joi);

const validMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"];
const validFileTypes = ["JPEG", "PNG", "GIF", "BMP", "WEBP"];

const fileValidation = (fieldName) => {
  return Joi.any().custom((value, helpers) => {
    const file = helpers.state.ancestors[0][fieldName];
    if (!file) {
      return helpers.message(`${fieldName} is required`);
    }
    if (!validMimeTypes.includes(file.mimetype)) {
      return helpers.message(`Invalid file type for ${fieldName}. Only ${validFileTypes.join(", ")} are allowed.`);
    }
    return value;
  }).optional();
};

export const adminSignup = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}

export const adminLogin = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}

export const pagination = {
  query: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    search: Joi.string().optional().allow('')
  })
}

export const createProduct = {
  body: Joi.object({
    name: Joi.string().required(),
    images: fileValidation('images'),
    discription:Joi.string().required(),
    price:Joi.number().required()
  }),
}

export const updateProduct = {
  body: Joi.object({
    name: Joi.string().optional(),
    images: fileValidation('images'),
    discription:Joi.string().optional(),
    price:Joi.number().optional()
  }),
  params: Joi.object({
    productId: Joi.objectId().required()
  })
}

export const productId = {
  params: Joi.object({
    productId: Joi.objectId().required()
  })
}

export const orderId = {
  params: Joi.object({
    orderId: Joi.objectId().required()
  })
}

export const updateUserStatus = {
  params: Joi.object({
    userId: Joi.objectId().required()
  }),
  body: Joi.object({
    isActive:Joi.boolean().required()
  }),
}

export const userId = {
  params: Joi.object({
    userId: Joi.objectId().required()
  })
}
