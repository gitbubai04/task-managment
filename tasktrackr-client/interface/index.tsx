export interface ISelectOption {
  value: string;
  label: string;
}

export type TUserRole = "user" | "admin";
export type TUserGender = "male" | "female" | "other";

export interface IUserProfile {
  _id: string;
  name: string;
  gender: TUserGender;
  email: string;
  phone: string;
  address: string;
  profession: string;
  image: string;
  role: TUserRole;
  dateOfBirth: string | null;
  is_deleted: boolean;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  last_login: string;
}

export interface ITaskFormData {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  catagory: string;
}

interface Icommon {
  _id: string;
  name: string;
  color: string;
}
export interface ITask {
  _id: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: string;
  priority: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
  catagory: string;
  category_details: Icommon;
  priority_details: Icommon;
  __v: number;
}

export interface ITaskBoard {
  todo: ITask[];
  pending: ITask[];
  "in-progress": ITask[];
  completed: ITask[];
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profession: string;
  image: string;
  role: string;
  is_active: boolean;
}
