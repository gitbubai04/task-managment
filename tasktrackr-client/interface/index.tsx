export interface IUserProfile {
    _id: string;
    name: string;
    gender: "male" | "female" | "other";
    email: string;
    phone: string;
    address: string;
    profession: string;
    image: string;
    role: "user" | "admin";
    dateOfBirth: string | null;
    is_deleted: boolean;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    last_login: string;
}
