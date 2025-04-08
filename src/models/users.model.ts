import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const ObjectId = Schema.Types.ObjectId;

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: Number,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  fcmToken: {
    type: String,
    default: ""
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

const userModel = model<User & Document>('User', userSchema);

export default userModel;
