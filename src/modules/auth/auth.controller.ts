import { Request, Response } from "express";
import { authService } from "./auth.service";

const register = async (req: Request, res: Response) => {

    const result = await authService.register(req.body);

    res.status(200).json({
        success: true,
        message: "User created successfully!",
        data: result,
    });

}

const login = async (req: Request, res: Response) => {

    const { accessToken, refreshToken } = await authService.login(req.body);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })

    res.status(200).json({
        success: true,
        message: "User logged in successfully!",
        data: accessToken,
    });
}

export const authController = {
    register,
    login
}