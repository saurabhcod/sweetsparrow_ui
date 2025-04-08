export interface User {
  _id: string;
  email: string;
  password: string;
  username: string;
  mobile: number;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  fcmToken: string;
  deletedBy: string;
  deletedByModel: string;
  deletedAt: Date;
}
