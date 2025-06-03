"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { ITask } from "@/interface";
import { CircleDot, Flag, CalendarDays } from "lucide-react";

interface TaskDetailsDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  task: ITask | null;
}

export default function TaskDetailsDialog({
  open,
  setOpen,
  task,
}: TaskDetailsDialogProps) {
  if (!task) return null;

  const formattedDueDate = task.dueDate
    ? moment(task.dueDate).format("MMM DD, YYYY")
    : "No due date";

  const createdAt = moment(task.createdAt).format("MMM DD, YYYY [at] h:mm A");
  const updatedAt = moment(task.updatedAt).format("MMM DD, YYYY [at] h:mm A");

  const priorityColor = {
    none: "bg-gray-300 text-gray-800",
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }[task.priority];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-muted-foreground text-sm whitespace-pre-wrap">
            {task.description || (
              <span className="italic">No description provided.</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Flag className="w-4 h-4 text-muted-foreground" />
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColor}`}
            >
              Priority: {task?.priority_details?.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Flag className="w-4 h-4 text-muted-foreground" />
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColor}`}
            >
              Catagory: {task?.category_details?.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span>Due: {formattedDueDate}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CircleDot className="w-4 h-4 text-muted-foreground" />
            <Badge variant="secondary" className="capitalize">
              Status: {task.status}
            </Badge>
          </div>

          <hr />

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Created: {createdAt}</p>
            <p>Last Updated: {updatedAt}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
