import { NextFunction, Request, Response } from "express";
import { USER_Role, USER_STATUS } from "../modules/user/user.constants";
import { catchAsync } from "../utils/catchAsync";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { User } from "../modules/user/user.model";
import AppError from "../errors/AppError";
export const auth = (...requiredRoles: (keyof typeof USER_Role)[]) => {

  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;
    const isVerified = jwt.verify(token as string, config.jwt_access_secret as string);

    const { role, email } = isVerified as JwtPayload;

    const user = await User.findOne({ email });
    if (user?.role !== role) {
      throw new AppError(401, 'You are not authorized to access this route, who gave you the access!');
    }

    if (user?.status === USER_STATUS.BLOCKED) {
      throw new AppError(401, 'Your account is Temporarily blocked!');
    }

    if (!requiredRoles.includes(role)) {
      throw new AppError(401, 'You are not authorized to access this route');
    }
    next();

  })
}