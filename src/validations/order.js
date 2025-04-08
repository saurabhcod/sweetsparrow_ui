import { Joi } from "express-validation";
import JoiObjectId from "joi-objectid";
Joi.objectId = JoiObjectId(Joi);


export const createOrder = {
  body: Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
          count: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
    address: Joi.string().required(),
  }),
};

export const orderId = {
  params: Joi.object({
    orderId: Joi.objectId().required()
  })
}
