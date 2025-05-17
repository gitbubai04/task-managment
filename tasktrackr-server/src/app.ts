import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import taskRouter from './routes/task.routes';
import userAdminRouter, { userRouter } from './routes/user.routes';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());

const ApiPrefix = '/api/v1';
const AdminPrefix = `${ApiPrefix}/admin`;

// Routes
app.use(ApiPrefix + '/auth', authRouter);
app.use(ApiPrefix + '/task', taskRouter);
app.use(ApiPrefix + '/user', userRouter);
app.use(AdminPrefix + '/user', userAdminRouter);

export default app;