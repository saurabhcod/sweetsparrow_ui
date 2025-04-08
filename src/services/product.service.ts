import productModel from '@/models/product.model';
import { Product } from '@/interfaces/product.interface';
import { User } from '@/interfaces/users.interface';
import { Pagination } from '@/interfaces/adminUser.interface';
import { isEmpty } from '@/utils/util';
import { HttpException } from '@/exceptions/HttpException';

class ProductService {
    public products = productModel;

    public async getProducts(user: User, pagination: Pagination): Promise<{ records: Array<Product>, count: number }> {
        const { limit, page, search } = pagination;
        const skip = limit * (page - 1);
        let query: any = {};
        if (pagination?.search) {
            query.$or = [
                { name: { $regex: `${search}`, $options: 'i' } },
            ]
            query.isDeleted = false;
        } else {
            query.isDeleted = false;
        }
        const data: Product[] = await this.products.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const count: number = await this.products.countDocuments(query);
        return { records: data, count }
    }

    public async getProductById(user: User, productId: string): Promise<Product> {
        if (isEmpty(productId)) throw new HttpException(400, 'product not found.');
        const productData: Product = await this.products.findOne({ _id: productId, isDeleted: false });

        return productData;
    }

}

export default ProductService;
