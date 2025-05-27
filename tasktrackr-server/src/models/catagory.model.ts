import mongoose, { Schema } from "mongoose";

export interface ICategory {
  name: string;
  color: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  is_deleted: boolean;
}

const categorySchema = new Schema<ICategory>({
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

export const categoryModel = mongoose.model<ICategory>(
  "Category",
  categorySchema
);
