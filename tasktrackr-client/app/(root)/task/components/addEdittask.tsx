"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { useFormik } from "formik";
import * as Yup from "yup";


export interface TaskFormData {
    title: string;
    description: string;
    dueDate: string;
    status: string;
    priority: string;
}

interface TaskDialogProps {
    initialData?: TaskFormData;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    dueDate: Yup.string().required("Due date is required"),
    status: Yup.string().required("Status is required"),
    priority: Yup.string().required("Priority is required"),
});

export default function TaskDialog({
    initialData,
    open,
    setOpen
}: TaskDialogProps) {
    const formik = useFormik<TaskFormData>({
        initialValues: initialData || {
            title: "",
            description: "",
            dueDate: "",
            status: "pending",
            priority: "low",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const handleSelectChange = (field: keyof TaskFormData, value: string) => {
        formik.setFieldValue(field, value);
    };

    const handleClose = () => {
        if (setOpen) {
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Task" : "Create New Task"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="text-sm text-red-500">{formik.errors.title}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="text-sm text-red-500">{formik.errors.description}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={formik.values.dueDate}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.dueDate && formik.errors.dueDate && (
                            <p className="text-sm text-red-500">{formik.errors.dueDate}</p>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label>Status</Label>
                            <Select
                                value={formik.values.status}
                                onValueChange={(value) => handleSelectChange("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label>Priority</Label>
                            <Select
                                value={formik.values.priority}
                                onValueChange={(value) => handleSelectChange("priority", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">{initialData ? "Update" : "Create"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
