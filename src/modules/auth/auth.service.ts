import { USER_Role } from "../user/user.constants";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { TUserLogin } from "./auth.interface";
import jwt from 'jsonwebtoken';
import { isPasswordCorrect } from "./auth.utils";
import config from "../../config";
const register = async (payload: TUser) => {

    // checking whether user already created with the given email or not.
    const isUserExist = await User.findOne({ email: payload.email });
    if (isUserExist) {
        throw new Error('User already Exist!')
    }

    // making the user a normal user for safety reason
    payload.role = USER_Role.USER;

    // creating the actual user
    const newUser = await User.create(payload);
    return newUser;

};

const login = async (payload: TUserLogin) => {

    // checking whether the user is available in out Database
    const user = await User.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new Error('User is not found')
    }

    // checking whether the user is blocked or not
    if (user.status === 'BLOCKED') {
        throw new Error('User is blocked')
    }

    // checking whether the password is correct
    const passwordCheck = await isPasswordCorrect(payload.password, user.password);
    if (!passwordCheck) {
        throw new Error('Password is not correct')
    }

    // creating a token so that we can send frontend a information
    const jwtPayload = {
        email: user.email,
        role: user.role
    }

    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: config.jwt_access_expires_in });
    const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret as string, { expiresIn: config.jwt_refresh_expires_in });


    return user;

}


export const authService = {
    register
}