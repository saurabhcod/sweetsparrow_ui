import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { forgotPassword, login, resetPassword, signup } from '@validations/auth';
import { validate } from "express-validation";

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validate(signup), this.authController.signUp);
    this.router.post(`${this.path}login`, validate(login), this.authController.logIn);
    this.router.get(`/:id/verify/:token`, this.authController.verifyLink);
    this.router.post(`${this.path}forgot-password`, validate(forgotPassword), this.authController.forgotPassword);
    this.router.post(`${this.path}reset-password/:token`, validate(resetPassword), this.authController.resetPassword);
  }
}

export default AuthRoute;
