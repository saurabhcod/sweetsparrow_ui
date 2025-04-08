import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { validate } from "express-validation";
import { pagination, productId } from '../validations/adminUser';
import authMiddleware from '@/middlewares/auth.middleware';
import ProductController from '@/controllers/product.controller';

class ProductRoute implements Routes {
    public path = '/product/';
    public router = Router();
    public productController = new ProductController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}get-product`, authMiddleware, validate(pagination), this.productController.getProducts);
        this.router.get(`${this.path}get-product/:productId`, authMiddleware, validate(productId), this.productController.getProductById);
    }
}

export default ProductRoute;
