import express from 'express';
import { changeStatusController, createTaskController, deleteTaskController, getAllTaskController, getAllTaskGroupController, getTaskByIdController, updateTaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const taskRouter = express.Router();

taskRouter.post('/add', authMiddleware, createTaskController);
taskRouter.get('/all', authMiddleware, getAllTaskGroupController);
taskRouter.get('/get-all', authMiddleware, getAllTaskController);
taskRouter.put('/update/:id', authMiddleware, updateTaskController);
taskRouter.get('/get/:id', authMiddleware, getTaskByIdController);
taskRouter.patch('/change-status/:id', authMiddleware, changeStatusController);
taskRouter.delete('/delete/:id', authMiddleware, deleteTaskController);

export default taskRouter;