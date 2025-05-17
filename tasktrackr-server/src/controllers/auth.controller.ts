import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { ApiError } from '../utils/error.util';
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from '../constant/http.constant';
import { EmailRegex, PasswordRegex, PhoneRegex } from '../constant/validator';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { GENDER, PROFESSION } from '../constant/enum';

// user signup controller
export const userSignUpController = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address, profession, image, dateOfBirth, password, gender, role } = req.body;
        const invalidField = validateRequiredFields(req.body, [
            'name',
            'email',
            'phone',
            'address',
            'profession',
            'password',
            'gender',
        ]);
        if (invalidField) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, `Field ${invalidField} is required or invalid`);
        }

        if (!PROFESSION.includes(profession) || !GENDER.includes(gender)) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Invalid profession or gender');
        }

        if (!EmailRegex.test(email)) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, HTTPS_MESSAGE.INVALID_EMAIL);
        }

        if (!PhoneRegex.test(phone)) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, HTTPS_MESSAGE.INVALID_PHONE);
        }

        if (!PasswordRegex.test(password)) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Password must contain at least 6 characters, including at least one letter and one number');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(HTTP_STATUSCODE.DUPLICATE_RECORD, 'Email already exists');
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            throw new ApiError(HTTP_STATUSCODE.DUPLICATE_RECORD, 'Phone number already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            address,
            profession,
            image: image || '',
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            password: hashedPassword,
            gender,
            role
        });

        if (!user) {
            throw new ApiError(HTTP_STATUSCODE.INTERNAL_ERROR, 'User registration failed');
        }

        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'User registered successfully',
        });
    } catch (error: unknown | ApiError) {
        console.error('Error in userSignUpController:', error);

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

// user login controller
export const UserLoginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const invalidField = validateRequiredFields(req.body, [
            'email',
            'password',
        ]);
        if (invalidField) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, `Field ${invalidField} is required or invalid`);
        }

        if (!EmailRegex.test(email)) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, HTTPS_MESSAGE.INVALID_EMAIL);
        }

        if (!PasswordRegex.test(password)) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Password must contain at least 6 characters, including at least one letter and one number');
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Invalid email Address');
        }

        if (!user.is_active || user.is_deleted) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'User is deleted or inactive');

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Wrong password!');
        }

        // set last login at
        user.last_login = new Date();
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        res.cookie('token_tasktrackr', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: expiryDate,
        });

        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'User logged in successfully',
            role: user.role

        });
    } catch (error: unknown | ApiError) {
        console.error('Error in userSignUpController:', error);

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

// user logout controller
export const UserLogoutController = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token_tasktrackr',
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            }
        );
        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'User logged out successfully',
        });
    } catch (error: unknown | ApiError) {
        console.error('Error in userSignUpController:', error);

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

