import { Request } from 'express';
import { User } from '@interfaces/users.interface';
import { AdminUser } from './adminUser.interface';

export interface DataStoredInToken {
  _id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
  admin: AdminUser;
}

export interface Signup {
  email: string;
  password: string;
  username: string;
  mobile: number;
  address: string;
}

export interface Login {
  email: string;
  password: string;
}