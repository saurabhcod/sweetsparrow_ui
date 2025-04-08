import { NextFunction, Request, Response } from 'express';
import { Login, Signup } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import sendMail from '@/utils/sendMail';
import userModel from '@/models/users.model';
import { hash } from "bcrypt";
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@/config';

class AuthController {
  public authService = new AuthService();
  public users = userModel;

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: Signup = req.body;
      const signupUserData: User = await this.authService.signup(userData);

      const token = this.authService.createToken(signupUserData);
      const url = `${process.env.BASE_URL}${signupUserData._id}/verify/${token.token}`;
      await sendMail(signupUserData.email, "Verify Email", url);

      const user: any = {
        "_id": signupUserData._id,
        "email": signupUserData.email
      }
      res.status(201).json({ data: { user }, message: 'Operation is successfully executed.' });
    } catch (error) {
      next(error);
    }
  };

  public verifyLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.users.findOne({ _id: req.params.id });
      if (!user) return res.status(400).json({ message: 'Invalid link' });

      await this.users.findOneAndUpdate({ _id: user._id }, { verified: true }, { new: true });

      res.status(201).json({ message: 'Email verified successfully' })
    } catch (error) {
      next(error);
    }
  }

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: Login = req.body;
      const { tokenData, findUser } = await this.authService.login(userData);
      const user: any = {
        _id: findUser._id,
        email: findUser.email
      }

      res.status(200).json({ data: { user: user, token: tokenData }, message: 'Operation is successfully executed.' });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user: User | null = await this.users.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const resetToken = this.authService.createToken(user);
      const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken.token}`;

      await sendMail(user.email, "Password Reset", `Please click the link to reset your password: ${resetUrl}`);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      next(error);
    }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const decoded: any = verify(token, SECRET_KEY);
      const user: User | null = await this.users.findOne({ _id: decoded._id });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const hashedPassword = await hash(password, 10);
      await this.users.findOneAndUpdate({ _id: user._id }, { password: hashedPassword });

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }

}

export default AuthController;
