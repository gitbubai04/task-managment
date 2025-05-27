import mongoose, { Schema } from "mongoose";
import { IPriority } from "../interface/priority.interface";

const prioritySchema = new Schema<IPriority>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: String,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IPriority>("Priority", prioritySchema);
