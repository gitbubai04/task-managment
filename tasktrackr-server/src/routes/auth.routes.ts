import express from 'express';
import { UserLoginController, UserLogoutController, userSignUpController } from '../controllers/auth.controller';
UserLogoutController
const authRouter = express.Router();

authRouter.post('/signup', userSignUpController);
authRouter.post('/signin', UserLoginController);
authRouter.post('/logout', UserLogoutController);

export default authRouter;