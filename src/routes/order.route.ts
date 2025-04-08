import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { validate } from "express-validation";
import { createOrder } from '../validations/order';
import OrderController from '@/controllers/order.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class OrderRoute implements Routes {
    public path = '/order/';
    public router = Router();
    public orderController = new OrderController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}create-order`, authMiddleware, validate(createOrder), this.orderController.createOrder);
        this.router.post(`/create-checkout-session`, this.orderController.paymentCheckout);
    }
}

export default OrderRoute;
