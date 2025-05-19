import { ISelectOption } from "@/interface";

export const priorityOptions: ISelectOption[] = [
    { value: "none", label: "None" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

export const statusOptions: ISelectOption[] = [
    { value: "todo", label: "To Do" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];