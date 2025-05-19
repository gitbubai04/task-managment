import { Card, CardContent } from "@/components/ui/card";
import { ITask } from "@/interface";
import {
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FlagTriangleRight, SquareMenuIcon } from "lucide-react";
import moment from "moment";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskDialog from "../addEdittask";
import { useEffect, useState } from "react";
import DeleteTaskDialog from "../deleteTask";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { DELETE_TASK_BY_ID_URL } from "@/lib/constants/api.constant";
import useAxios from "@/hooks/useAxios.hook";
import useSnackbar from "@/hooks/useSnackbar.hook";
import TaskDetailsDialog from "../taskDetails";

function getPriorityColor(priority: ITask["priority"]) {
    switch (priority) {
        case "high":
            return "text-red-500";
        case "medium":
            return "text-yellow-500";
        case "low":
            return "text-green-500";
        default:
            return "text-gray-400";
    }
}

function TaskCard({ task, setFetchData }: { task: ITask, setFetchData?: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteData, setDeleteData] = useState<ITask | null>(null);
    const [editData, setEditData] = useState<ITask | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsData, setDetailsData] = useState<ITask | null>(null);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task._id,
    });
    const [deleteRes, isDeleteResLoading, deleteResRequest] = useAxios<ITask, null>(DELETE_TASK_BY_ID_URL + deleteData?._id, "DELETE");
    useSnackbar(deleteRes?.message, deleteRes?.success ? "success" : "error");

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
    };

    const handelEditOpen = (data: ITask) => { setOpen(true); setEditData(data) }
    const handelDeleteOpen = (data: ITask) => {
        setDeleteOpen(true);
        setDeleteData(data);
    }

    const handelDetailsOpen = (data: ITask) => {
        setDetailsOpen(true);
        setDetailsData(data);
    }

    const handelTaskDelete = () => {
        deleteResRequest();
    }

    useEffect(() => {
        if (deleteRes?.success) {
            setDeleteOpen(false);
            setDeleteData(null);
            if (setFetchData) setFetchData(true);
        }
    }, [deleteRes, setFetchData]);

    return (
        <>
            {open && (
                <TaskDialog open={open} setOpen={setOpen} editData={editData} setFetchData={setFetchData} />
            )}
            {deleteOpen && (
                <DeleteTaskDialog open={deleteOpen} setOpen={setDeleteOpen} taskTitle={deleteData?.title}>
                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleteResLoading}
                        onClick={handelTaskDelete}
                    >
                        Delete
                    </AlertDialogAction>
                </DeleteTaskDialog>
            )}
            {detailsOpen && <TaskDetailsDialog open={detailsOpen} setOpen={setDetailsOpen} task={detailsData} />}
            <div ref={setNodeRef} {...attributes} style={style} className={`mb-2 ${isDragging ? "shadow-2xl scale-105" : ""}`}>
                <Card className="bg-white dark:bg-gray-900 border shadow rounded-xl">
                    <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" {...listeners} className="cursor-grab">
                                    <SquareMenuIcon />
                                </Button>
                                <h3 className="font-semibold text-sm truncate overflow-hidden whitespace-nowrap w-20">
                                    {task.title}
                                </h3>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-1 rounded hover:bg-accent">
                                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => handelEditOpen(task)}>
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handelDetailsOpen(task)}>
                                        <Info className="w-4 h-4 mr-2" />
                                        Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handelDeleteOpen(task)}
                                        className="text-red-500 focus:text-red-500"
                                    >
                                        <Trash className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {task.description && (
                            <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                        )}
                        {task.dueDate && (
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">Due:</span>{" "}
                                {moment(task.dueDate).format("MMM D, YYYY")}
                                {" (" + moment(task.dueDate).fromNow() + ")"}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            <span className="font-medium">Created:</span>{" "}
                            {moment(task.createdAt).format("MMM D, YYYY, h:mm A")}
                        </p>
                        <div className="flex items-end justify-end">
                            <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
                            <FlagTriangleRight className={`h-5 w-5 ${getPriorityColor(task.priority)}`} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default TaskCard;