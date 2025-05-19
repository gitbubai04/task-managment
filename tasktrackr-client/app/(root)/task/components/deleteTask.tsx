"use client";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useCallback } from "react";

interface DeleteTaskDialogProps {
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    taskTitle?: string;
    children?: React.ReactNode;
}

export default function DeleteTaskDialog({ open, taskTitle, setOpen, children }: DeleteTaskDialogProps) {
    const handleClose = useCallback(() => {
        if (setOpen) {
            setOpen(false);
        }
    }, [setOpen]);
    return (
        <AlertDialog open={open} onOpenChange={handleClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete <strong>{taskTitle || "this task"}</strong>.
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
                    {children}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
