import { model, Schema, Document } from 'mongoose';
import { Cart } from '@/interfaces/cart.interface';

const ObjectId = Schema.Types.ObjectId;

const cartSchema: Schema = new Schema({
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

const cartModel = model<Cart & Document>('Cart', cartSchema);

export default cartModel;
