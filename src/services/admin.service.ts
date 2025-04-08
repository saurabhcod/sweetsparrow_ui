import { ADMIN_SECRET_KEY, JWT_EXPIRES_IN } from '@/config';
import { sign } from 'jsonwebtoken';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { compare, hash } from 'bcrypt';
import adminUserModel from '@/models/adminUser.model';
import { AdminLogin, AdminSignup, AdminUser, Pagination } from '@/interfaces/adminUser.interface';
import productModel from '@/models/product.model';
import { CreateProduct, Product, UpdateProduct } from '@/interfaces/product.interface';
import { Order } from '@/interfaces/order.interface';
import orderModel from '@/models/order.model';
import userModel from '@/models/users.model';
import { User } from '@/interfaces/users.interface';

class AdminService {
    public adminUsers = adminUserModel;
    public products = productModel;
    public orders = orderModel;
    public users = userModel;

    public async getUsersByAdmin(admin: AdminUser, pagination: Pagination): Promise<{ records: Array<User>, count: number }> {
        const { limit, page, search } = pagination;
        const skip = limit * (page - 1);
        let query: any = {};
        if (pagination?.search) {
            query.$or = [
                { username: { $regex: `${search}`, $options: 'i' } },
                { email: { $regex: `${search}`, $options: 'i' } },
            ]
            query.isDeleted = false;
        } else {
            query.isDeleted = false;
        }
        const data: User[] = await this.users.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const count: number = await this.users.countDocuments(query);
        return { records: data, count }
    }

    public async getProductByAdmin(admin: AdminUser, pagination: Pagination): Promise<{ records: Array<Product>, count: number }> {
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

    public async getOrderByAdmin(admin: AdminUser, pagination: Pagination): Promise<{ records: Array<Order>, count: number }> {
        const { limit, page, search } = pagination;
        const skip = limit * (page - 1);

        let matchStage: any = { isDeleted: false };

        if (pagination?.search) {
            matchStage.$or = [
                { name: { $regex: `${search}`, $options: 'i' } },
            ]
        }

        const pipeline = [
            { $match: matchStage },
            // {
            //     $lookup: {
            //         from: "products",
            //         localField: "products.productId",
            //         foreignField: "_id",
            //         as: "productDetails"
            //     }
            // },
            // {
            //     $unwind: {
            //         path: "$products",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]

        const data: Order[] = await this.orders.aggregate(pipeline);
        const count: number = await this.orders.countDocuments(matchStage);
        return { records: data, count }
    }

    public async updateProductByAdmin(updateProduct: UpdateProduct, productId: string, admin: AdminUser): Promise<Product> {
        if (isEmpty(updateProduct)) throw new HttpException(400, "updateProduct data not found.");

        const findCat: Product = await this.products.findOne({ _id: productId });
        if (isEmpty(findCat)) throw new HttpException(400, "Product data not found.");

        const updatedCategoryData: Product = await this.products.findOneAndUpdate({ _id: productId, isDeleted: false }, updateProduct, { new: true });

        return updatedCategoryData;
    }

    public async updateUserStatusByAdmin(admin: AdminUser, data: any, userId: string): Promise<void> {
        if (isEmpty(userId)) throw new HttpException(400, "User not found.");

        await this.users.findOneAndUpdate({ _id: userId }, { isActive: data.isActive }, { new: true });
    }

    public async deleteProductByAdmin(admin: AdminUser, productId: string): Promise<void> {
        await this.products.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true, isActive: false, deletedAt: new Date() }, { new: true });
    }

    public async deleteOrderByAdmin(admin: AdminUser, orderId: string): Promise<void> {
        await this.orders.findOneAndUpdate({ _id: orderId, isDeleted: false }, { isDeleted: true, deletedBy: admin._id, deletedAt: new Date(), isOrderCancle: true }, { new: true });
    }

    public async deleteUserByAdmin(admin: AdminUser, userId: string): Promise<void> {
        if (isEmpty(userId)) throw new HttpException(400, "User not found.");

        await this.users.findOneAndDelete({ _id: userId })
    }

    public async removeUserByAdmin(admin: AdminUser, userId: string): Promise<void> {
        await this.users.findOneAndUpdate({ _id: userId, isDeleted: false }, { isDeleted: true, deletedBy: admin._id, deletedAt: new Date(), deletedByModel: 'AdminUser' }, { new: true });
    }

    public async createProduct(data: CreateProduct): Promise<Product> {
        if (isEmpty(data)) throw new HttpException(400, "Product data not found");

        const createProduct: Product = await this.products.create({ ...data });

        return createProduct
    }

    public async adminSignup(adminData: AdminSignup): Promise<AdminUser> {
        if (isEmpty(adminData)) throw new HttpException(400, "Admin User data not found.");

        const findAdminUser: AdminUser = await this.adminUsers.findOne({ email: adminData.email });
        if (findAdminUser) throw new HttpException(409, `This email is already exists.`);

        const hashedPassword = await hash(adminData.password, 10);
        const createAdminUserData: AdminUser = await this.adminUsers.create({ ...adminData, password: hashedPassword });

        return createAdminUserData;
    }

    public async adminLogin(adminData: AdminLogin): Promise<{ tokenData: TokenData; findAdminUser: AdminUser }> {
        if (isEmpty(adminData)) throw new HttpException(400, "Login details not found.");

        const findAdminUser: AdminUser = await this.adminUsers.findOne({ email: adminData.email });
        if (!findAdminUser) throw new HttpException(409, `Admin User not found.`);

        const isPasswordMatching: boolean = await compare(adminData.password, findAdminUser.password);
        if (!isPasswordMatching) throw new HttpException(409, "Incorrect password.");

        const tokenData = this.createAdminToken(findAdminUser);

        return { tokenData, findAdminUser };
    }

    public createAdminToken(adminUser: AdminUser): TokenData {
        const dataStoredInToken: DataStoredInToken = { _id: adminUser._id };
        const secretKey: string = ADMIN_SECRET_KEY;
        const expiresIn: number = eval(JWT_EXPIRES_IN);
        return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
    }
}

export default AdminService;
