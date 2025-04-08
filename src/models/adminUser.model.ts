import { AdminUser } from '@/interfaces/adminUser.interface';
import { model, Schema, Document } from 'mongoose';

const adminUserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: ""
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

const adminUserModel = model<AdminUser & Document>('AdminUser', adminUserSchema);

export default adminUserModel;
