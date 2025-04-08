import { model, Schema, Document } from 'mongoose';
import { Product } from '@/interfaces/product.interface';

const ObjectId = Schema.Types.ObjectId;

const productSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    images: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: null
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    availableStock: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
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

const productModel = model<Product & Document>('Product', productSchema);

export default productModel;
