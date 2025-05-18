import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import taskRouter from './routes/task.routes';
import userAdminRouter, { userRouter } from './routes/user.routes';
import fileUpload from 'express-fileupload';
import path from 'path';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const ApiPrefix = '/api/v1';
const AdminPrefix = `${ApiPrefix}/admin`;

// Routes
app.use(ApiPrefix + '/auth', authRouter);
app.use(ApiPrefix + '/task', taskRouter);
app.use(ApiPrefix + '/user', userRouter);
app.use(AdminPrefix + '/user', userAdminRouter);

export default app;