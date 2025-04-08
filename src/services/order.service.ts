import { HttpException } from '@/exceptions/HttpException';
import { CreateOrder, Order } from '@/interfaces/order.interface';
import orderModel from '@/models/order.model';
import { isEmpty } from '@/utils/util';

class OrderService {
    public order = orderModel;

    public async createOrder(data: CreateOrder): Promise<Order> {
        if (isEmpty(data)) throw new HttpException(400, "Product data not found");

        const createOrder: Order = await this.order.create({ ...data });

        return createOrder
    }

}

export default OrderService;
