import { CreateOrder, Order } from '@/interfaces/order.interface';
import OrderService from '@/services/order.service';
import { NextFunction, Request, Response } from 'express';
const stripe = require("stripe")(process.env.STRIPE_SECRET);

class OrderController {
    public orderService = new OrderService();

    public createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reqData: CreateOrder = req.body;
            const orderData: Order = await this.orderService.createOrder(reqData);

            res.status(201).json({ data: { orderData }, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public paymentCheckout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { products } = req.body;
            const lineItems = products.map((product) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image]
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: product.quantity
            }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/cancel"
            });

            res.json({ id: session.id });

        } catch (error) {
            next(error);
        }
    }

}

export default OrderController;
