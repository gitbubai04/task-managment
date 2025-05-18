import { Request, Response } from 'express';
import { ApiError } from '../utils/error.util';
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from '../constant/http.constant';
import userModel from '../models/user.model';
import { TASK_STATUS } from '../constant/enum';
import { validateFiles } from '../utils/validateRequiredFields';
import { deleteAndUploadImage } from '../utils/fileUpload.util';
import { UploadedFile } from 'express-fileupload';

// get all users for admin
export const getUsersController = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query = {
            ...(search ? { name: { $regex: new RegExp(search as string, "i") } } : {})
        };

        const users = await userModel
            .find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const total = await userModel.countDocuments(query);
        const totalPages = Math.ceil(total / limitNumber);
        const totalUser = await userModel.countDocuments()
        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            data: {
                users,
                totalUser,
                pagination: {
                    total,
                    page: pageNumber,
                    totalPages,
                    limit: limitNumber,
                },
            },

        });
    } catch (error: unknown | ApiError) {
        if (error instanceof ApiError) {
            res.status(error.status).json({ success: false, message: error.message });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
        }
    }
};

// get user by id
export const getMeController = async (req: Request, res: Response) => {
    try {
        const { userId: user_id } = res.locals;
        const user = await userModel.findById({ _id: user_id, is_deleted: false }).select('-password');

        if (!user) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'User not found!');
        }
        res.status(HTTP_STATUSCODE.OK).json({ success: true, data: user });
    } catch (error: unknown | ApiError) {
        if (error instanceof ApiError) {
            res.status(error.status).json({ success: false, message: error.message });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
        }
    }
}

// get user by id
export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById({ _id: id, is_deleted: false }).select('-password');

        if (!user) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'User not found!');
        }
        res.status(HTTP_STATUSCODE.OK).json({ success: true, data: user });
    } catch (error: unknown | ApiError) {
        if (error instanceof ApiError) {
            res.status(error.status).json({ success: false, message: error.message });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
        }
    }
}

// delete user by id
export const deleteUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId: user_id } = res.locals;

        const user = await userModel.findByIdAndUpdate({ _id: id, is_deleted: false },
            {
                $set: {
                    is_deleted: true,
                    deletedBy: user_id,
                    deletedAt: new Date(),
                }
            },
        );
        if (!user) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'User not found!');
        }

        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error: unknown | ApiError) {
        if (error instanceof ApiError) {
            res.status(error.status).json({ success: false, message: error.message });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
        }
    }
}

// update change status by id
export const changeUserStatusController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId: user_id } = res.locals;
        const { status } = req.body;

        if (!TASK_STATUS.includes(status)) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Invalid status!');
        }

        const user = await userModel.findByIdAndUpdate({ _id: id, is_deleted: false },
            {
                $set: {
                    status,
                    updatedBy: user_id,
                    updatedAt: new Date(),
                }
            },
        );
        if (!user) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'User not found!');
        }

        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'User status change to ' + status,
        })
    } catch (error: unknown | ApiError) {
        if (error instanceof ApiError) {
            res.status(error.status).json({ success: false, message: error.message });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
        }
    }
}

// update profile image by id
export const updateProfileImageController = async (req: Request, res: Response) => {
    try {
        const { userId: user_id } = res.locals;
        let image;

        const user = await userModel.findById({ _id: user_id, is_deleted: false });

        if (!validateFiles(req.files, 'image')) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Invalid image!');
        }

        image = await deleteAndUploadImage(req?.files?.image as UploadedFile, "profile_image" + Date.now(), user?.image);

        const updatedUser = await userModel.findByIdAndUpdate({ _id: user_id, is_deleted: false },
            {
                $set: {
                    image: image,
                    updatedBy: user_id,
                    updatedAt: new Date(),
                }
            },
        );
        if (!updatedUser) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'User not found!');
        }
        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'Profile image updated successfully',
        })
    } catch (error: unknown | ApiError) {
        if (error instanceof ApiError) {
            res.status(error.status).json({ success: false, message: error.message });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
        }
    }
}