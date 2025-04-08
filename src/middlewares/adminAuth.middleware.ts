import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ADMIN_SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import adminUserModel from '@/models/adminUser.model';

const adminAuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

        if (Authorization) {
            const secretKey: string = ADMIN_SECRET_KEY;
            const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
            const userId = verificationResponse._id;
            const admin = await adminUserModel.findById(userId);

            if (admin) {
                req.admin = admin;
                next();
            } else {
                next(new HttpException(401, 'Wrong authentication token'));
            }
        } else {
            next(new HttpException(404, 'Authentication token missing'));
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication token'));
    }
};

export default adminAuthMiddleware;
