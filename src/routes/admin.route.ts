import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AdminController from '@/controllers/admin.controller';
import { validate } from "express-validation";
import { adminSignup, adminLogin, createProduct, pagination, updateProduct, productId, orderId, updateUserStatus, userId } from '../validations/adminUser';
import adminAuthMiddleware from '@/middlewares/adminAuth.middleware';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/uploads/product-images`);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = file.originalname;
        const extension = path.extname(originalName);
        const baseName = path.basename(originalName, extension);
        const newFilename = `${baseName}_${timestamp}${extension}`;
        cb(null, newFilename);
    },
});

const upload = multer({ storage }).single('images');

class AdminRoute implements Routes {
    public path = '/admin/';
    public router = Router();
    public adminController = new AdminController();

    constructor() {
        this.initializeRoutes();
    }

    private attachProductImageToBody(req, res, next) {
        if (req.file) {
            req.body.images = req.file;
        }
        next();
    }

    private initializeRoutes() {
        this.router.put(`${this.path}update-product/:productId`, upload, this.attachProductImageToBody, validate(updateProduct), adminAuthMiddleware, this.adminController.updateProductByAdmin);
        this.router.put(`${this.path}update-user-status/:userId`, adminAuthMiddleware, validate(updateUserStatus), this.adminController.updateUserStatusByAdmin);
        this.router.get(`${this.path}get-user`, adminAuthMiddleware, validate(pagination), this.adminController.getUsersByAdmin);
        this.router.get(`${this.path}get-product`, adminAuthMiddleware, validate(pagination), this.adminController.getProductByAdmin);
        this.router.get(`${this.path}get-order`, adminAuthMiddleware, validate(pagination), this.adminController.getOrderByAdmin);
        this.router.post(`${this.path}create-product`, upload, this.attachProductImageToBody, validate(createProduct), this.adminController.createProduct);
        this.router.delete(`${this.path}delete-product/:productId`, adminAuthMiddleware, validate(productId), this.adminController.deleteProductByAdmin);
        this.router.delete(`${this.path}delete-order/:orderId`, adminAuthMiddleware, validate(orderId), this.adminController.deleteOrderByAdmin);
        this.router.delete(`${this.path}delete-user/:userId`, adminAuthMiddleware, validate(userId), this.adminController.deleteUserByAdmin);
        this.router.delete(`${this.path}remove-user/:userId`, adminAuthMiddleware, validate(userId), this.adminController.removeUserByAdmin);
        this.router.post(`${this.path}signup`, validate(adminSignup), this.adminController.signUp);
        this.router.post(`${this.path}login`, validate(adminLogin), this.adminController.logIn);
    }
}

export default AdminRoute;
