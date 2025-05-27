import { Document } from "mongoose";

export interface IPriority extends Document {
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  is_deleted: boolean;
  createdBy: string;
}
