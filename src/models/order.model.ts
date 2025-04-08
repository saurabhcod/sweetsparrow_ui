import { model, Schema, Document } from 'mongoose';
import { Order } from '@/interfaces/order.interface';

const ObjectId = Schema.Types.ObjectId;

const orderSchema: Schema = new Schema({
    userId: {
        type: ObjectId,
        ref: "User"
    },
    products: [{
        productId: {
            type: ObjectId,
            ref: "Product"
        },
        count: Number,
    }],
    status: {
        type: String,
        enum: ["pending", "processing", "deleverd"],
    },
    address: {
        type: String,
        required: true
    },
    isOrderCancle: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: ObjectId,
        refPath: 'deletedByModel',
        default: null
    },
    deletedByModel: {
        type: String,
        enum: ['User', 'AdminUser', null],
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

const orderModel = model<Order & Document>('Order', orderSchema);

export default orderModel;
