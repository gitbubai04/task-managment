import express from 'express';
import { authAdminMiddleware, authMiddleware } from '../middleware/auth.middleware';
import { changeUserStatusController, deleteUserByIdController, getMeController, getUserByIdController, getUsersController, updateProfileImageController } from '../controllers/user.controller';

const userAdminRouter = express.Router();
export const userRouter = express.Router();

userAdminRouter.get('/all', authAdminMiddleware, getUsersController);
userAdminRouter.get('/profile', authAdminMiddleware, getMeController);
userRouter.get('/profile', authMiddleware, getMeController);
userAdminRouter.get('/get/:id', authAdminMiddleware, getUserByIdController);
userAdminRouter.delete('/delete/:id', authAdminMiddleware, deleteUserByIdController);
userAdminRouter.patch('/change-status/:id', authAdminMiddleware, changeUserStatusController);
userAdminRouter.patch('/change-profile', authAdminMiddleware, updateProfileImageController);
userRouter.patch('/change-profile', authMiddleware, updateProfileImageController);

export default userAdminRouter;