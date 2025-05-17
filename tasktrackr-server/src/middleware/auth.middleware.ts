import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error.util";
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from "../constant/http.constant";
import { verifyToken } from "../utils/jwt.utils";
import userModel from "../models/user.model";

export const authAdminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token_tasktrackr;
        if (!token)
            throw new ApiError(
                HTTP_STATUSCODE.AUTH_FAILED,
                HTTPS_MESSAGE.NOT_AUTHORISED
            );

        const decoded = verifyToken(token);
        if (!decoded)
            throw new ApiError(
                HTTP_STATUSCODE.AUTH_FAILED,
                HTTPS_MESSAGE.NOT_AUTHORISED
            );

        const user = await userModel.findOne({
            _id: decoded.userId,
            is_deleted: false,
            is_active: true,
            role: "admin",
        });
        if (!user)
            throw new ApiError(HTTP_STATUSCODE.NOT_PRESENT, "User is not present");

        res.locals.userId = decoded.userId;
        next();
    } catch (error: unknown | ApiError) {
        if (error instanceof ApiError) {
            res.status(error.status).json({
                success: false,
                message: error.message,
            });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({
                success: false,
                message: HTTPS_MESSAGE.INTERNAL_ERROR,
            });
        }
    }
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token_tasktrackr;
        if (!token)
            throw new ApiError(
                HTTP_STATUSCODE.AUTH_FAILED,
                HTTPS_MESSAGE.NOT_AUTHORISED
            );

        const decoded = verifyToken(token);
        if (!decoded)
            throw new ApiError(
                HTTP_STATUSCODE.AUTH_FAILED,
                HTTPS_MESSAGE.NOT_AUTHORISED
            );

        const user = await userModel.findOne({
            _id: decoded.userId,
            is_deleted: false,
            is_active: true,
            role: "user",
        });
        if (!user)
            throw new ApiError(HTTP_STATUSCODE.NOT_PRESENT, "User is not present");

        res.locals.userId = decoded.userId;
        next();
    } catch (error: unknown | ApiError) {
        if (error instanceof ApiError) {
            res.status(error.status).json({
                success: false,
                message: error.message,
            });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({
                success: false,
                message: HTTPS_MESSAGE.INTERNAL_ERROR,
            });
        }
    }
}