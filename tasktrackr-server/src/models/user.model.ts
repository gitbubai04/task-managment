import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interface/user.interface';
import { GENDER, PROFESSION, ROLE } from '../constant/enum';

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        enum: GENDER,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,

    },
    profession: {
        type: String,
        required: true,
        enum: PROFESSION
    },
    image: {
        type: String,
        default: '',
        trim: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ROLE,
    },
    dateOfBirth: {
        type: Date
    },
    password: {
        type: String,
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
    last_login: {
        type: Date
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model<IUser>('User', userSchema);