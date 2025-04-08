import { NextFunction, Request, Response } from 'express';
import AdminService from '@/services/admin.service';
import { AdminLogin, AdminSignup, AdminUser, Pagination } from '@/interfaces/adminUser.interface';
import { CreateProduct, Product, UpdateProduct } from '@/interfaces/product.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';

class AdminController {
    public adminService = new AdminService();

    public getUsersByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const admin = req.admin;
            const pagination: Pagination = req.query;
            if (req.query.limit && req.query.page && parseInt(req.query.limit as string) && parseInt(req.query.page as string)) {
                pagination.limit = parseInt(req.query.limit as string);
                pagination.page = parseInt(req.query.page as string);
            }
            if (req.query.search) {
                pagination.search = req.query.search as string;
            }
            const response = await this.adminService.getUsersByAdmin(admin, pagination);

            res.status(200).json({ data: response, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public getProductByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const admin = req.admin;
            const pagination: Pagination = req.query;
            if (req.query.limit && req.query.page && parseInt(req.query.limit as string) && parseInt(req.query.page as string)) {
                pagination.limit = parseInt(req.query.limit as string);
                pagination.page = parseInt(req.query.page as string);
            }
            if (req.query.search) {
                pagination.search = req.query.search as string;
            }
            const response = await this.adminService.getProductByAdmin(admin, pagination);

            res.status(200).json({ data: response, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public getOrderByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const admin = req.admin;
            const pagination: Pagination = req.query;
            if (req.query.limit && req.query.page && parseInt(req.query.limit as string) && parseInt(req.query.page as string)) {
                pagination.limit = parseInt(req.query.limit as string);
                pagination.page = parseInt(req.query.page as string);
            }
            if (req.query.search) {
                pagination.search = req.query.search as string;
            }
            const response = await this.adminService.getOrderByAdmin(admin, pagination);

            res.status(200).json({ data: response, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public updateProductByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const productData: UpdateProduct = req.body;
            const admin: AdminUser = req.admin;
            const productId: string = req.params.productId;
            if (req.body.images) {
                productData.images = `/uploads/product-images/${req.body.images.filename}`;
            }
            const resData = await this.adminService.updateProductByAdmin(productData, productId, admin);

            res.status(200).json({ data: resData, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public updateUserStatusByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const admin = req.admin;
            const userId: string = req.params.userId;
            const data = req.body;

            await this.adminService.updateUserStatusByAdmin(admin, data, userId);

            res.status(200).json({ data: {}, message: 'User status updated successfully.' });
        } catch (error) {
            next(error);
        }
    }

    public deleteProductByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const admin: AdminUser = req.admin;
            const productId: string = req.params.productId;
            await this.adminService.deleteProductByAdmin(admin, productId);

            res.status(200).json({ data: {}, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public deleteOrderByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const admin: AdminUser = req.admin;
            const orderId: string = req.params.orderId;
            await this.adminService.deleteOrderByAdmin(admin, orderId);

            res.status(200).json({ data: {}, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public deleteUserByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const admin = req.admin;
            const userId: string = req.params.userId;
            await this.adminService.deleteUserByAdmin(admin, userId);

            res.status(200).json({ data: {}, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public removeUserByAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const admin = req.admin;
            const userId: string = req.params.userId;
            await this.adminService.removeUserByAdmin(admin, userId);

            res.status(200).json({ data: {}, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reqData: CreateProduct = req.body;
            if (req.body.images) {
                reqData.images = `/uploads/product-images/${req.body.images.filename}`;
            }
            const productData: Product = await this.adminService.createProduct(reqData);
            res.status(201).json({ data: { productData }, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const adminData: AdminSignup = req.body;
            const signupAdminData: AdminUser = await this.adminService.adminSignup(adminData);
            const admin: any = {
                "_id": signupAdminData._id,
                "email": signupAdminData.email
            }
            res.status(201).json({ data: { admin }, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    };

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const adminData: AdminLogin = req.body;
            const { tokenData, findAdminUser } = await this.adminService.adminLogin(adminData);
            const adminUser: any = {
                _id: findAdminUser._id,
                email: findAdminUser.email,
            }

            res.status(200).json({ data: { adminUser: adminUser, token: tokenData }, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    };

}

export default AdminController;
