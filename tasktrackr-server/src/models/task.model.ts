import mongoose, { Schema } from "mongoose";
import { TASK_PRIORITY, TASK_STATUS } from "../constant/enum";
import { ITask } from "../interface/task.interface";

const taskSchema = new Schema<ITask>({
  title: {
    required: true,
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: String,
    ref: "Priority",
  },
  catagory: {
    type: String,
    ref: "Catagory",
  },

  dueDate: {
    type: Date,
  },
  status: {
    required: true,
    type: String,
    enum: TASK_STATUS,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    ref: "User",
  },
  updatedBy: {
    type: String,
    ref: "User",
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<ITask>("Task", taskSchema);
