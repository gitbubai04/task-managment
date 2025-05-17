import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    address: string;
    profession: string;
    image: string;
    dateOfBirth: Date;
    password: string;
    gender: string;
    role: string;
}