import { NextFunction, Response } from 'express';
import { Pagination } from '@/interfaces/adminUser.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import ProductService from '@/services/product.service';

class ProductController {
    public productService = new ProductService();

    public getProducts = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const pagination: Pagination = req.query;
            if (req.query.limit && req.query.page && parseInt(req.query.limit as string) && parseInt(req.query.page as string)) {
                pagination.limit = parseInt(req.query.limit as string);
                pagination.page = parseInt(req.query.page as string);
            }
            if (req.query.search) {
                pagination.search = req.query.search as string;
            }
            const response = await this.productService.getProducts(user, pagination);

            res.status(200).json({ data: response, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

    public getProductById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const productId = req.params.productId;

            const response = await this.productService.getProductById(user, productId);

            res.status(200).json({ data: response, message: 'Operation is successfully executed.' });
        } catch (error) {
            next(error);
        }
    }

}

export default ProductController;
