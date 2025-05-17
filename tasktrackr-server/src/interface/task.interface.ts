import { Document } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    priority: string;
    dueDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    is_deleted: boolean;
}