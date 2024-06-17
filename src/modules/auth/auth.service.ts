import { USER_Role } from "../user/user.constants";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";

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

}


export const authService = {
    register
}