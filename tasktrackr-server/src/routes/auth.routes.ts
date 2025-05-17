import express from 'express';
import { UserLoginController, userSignUpController } from '../controllers/auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', userSignUpController);
authRouter.post('/signin', UserLoginController);

export default authRouter;