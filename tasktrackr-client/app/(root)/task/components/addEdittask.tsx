"use client";
import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ITask, ITaskFormData } from "@/interface";
import { statusOptions } from "@/lib/constants/options.constant";
import {
  ADD_TASK_URL,
  GET_ALL_CATAGORY,
  GET_ALL_PRIORITY,
  UPDATE_TASK_BY_ID_URL,
} from "@/lib/constants/api.constant";
import useAxios from "@/hooks/useAxios.hook";
import useSnackbar from "@/hooks/useSnackbar.hook";
import moment from "moment";

interface TaskDialogProps {
  editData?: ITask | null;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setFetchData?: React.Dispatch<React.SetStateAction<boolean>>;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  dueDate: Yup.string().required("Due date is required"),
  status: Yup.string().required("Status is required"),
  priority: Yup.string().required("Priority is required"),
});

interface Icommon {
  _id: string;
  name: string;
  color: string;
}

export default function TaskDialog({
  editData,
  open,
  setOpen,
  setFetchData,
}: TaskDialogProps) {
  const [taskRes, isSubmitting, taskRequest] = useAxios<ITaskFormData, null>(
    ADD_TASK_URL,
    "POST"
  );
  const [updateTaskRes, isUpdateSubmitting, updateTaskRequest] = useAxios<
    ITaskFormData,
    null
  >(UPDATE_TASK_BY_ID_URL + "/" + editData?._id, "PUT");

  const [catagoryRes, , getAllCatagoryRequest] = useAxios<Icommon[], null>(
    GET_ALL_CATAGORY,
    "GET"
  );
  const [priorityRes, , getAllPriorityRequest] = useAxios<Icommon[], null>(
    GET_ALL_PRIORITY,
    "GET"
  );
  useSnackbar(taskRes?.message, taskRes?.success ? "success" : "error");
  useSnackbar(
    updateTaskRes?.message,
    updateTaskRes?.success ? "success" : "error"
  );

  const [priorityList, setPriority] = React.useState<Icommon[]>([]);
  const [catagoryList, setCatagory] = React.useState<Icommon[]>([]);

  const formik = useFormik<ITaskFormData>({
    initialValues: {
      title: editData?.title || "",
      description: editData?.description || "",
      dueDate: editData?.dueDate || "",
      status: editData?.status || "todo",
      priority: editData?.priority || priorityList[0]?._id,
      catagory: editData?.catagory || catagoryList[0]?._id,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (!!editData) {
        updateTaskRequest(values);
      } else {
        taskRequest(values);
      }
    },
  });

  const handleSelectChange = (field: keyof ITaskFormData, value: string) => {
    formik.setFieldValue(field, value);
  };

  const handleClose = useCallback(() => {
    if (setOpen) {
      setOpen(false);
    }
  }, [setOpen]);

  React.useEffect(() => {
    if (taskRes?.success || updateTaskRes?.success) {
      handleClose();
      if (setFetchData) setFetchData(true);
    }
  }, [taskRes, handleClose, setFetchData, updateTaskRes]);

  React.useEffect(() => {
    getAllCatagoryRequest();
    getAllPriorityRequest();
  }, []);

  React.useEffect(() => {
    if (catagoryRes?.success && catagoryRes?.data) {
      setCatagory(catagoryRes.data);
    }
  }, [catagoryRes]);

  React.useEffect(() => {
    if (priorityRes?.success && priorityRes?.data) {
      setPriority(priorityRes.data);
    }
  }, [priorityRes]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title" className="mb-2 block">
              Title
            </Label>
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
            <Label htmlFor="description" className="mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500">
                {formik.errors.description}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="dueDate" className="mb-2 block">
              Due Date
            </Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={
                formik.values.dueDate
                  ? moment(formik.values.dueDate).format("YYYY-MM-DD")
                  : ""
              }
              onChange={formik.handleChange}
            />
            {formik.touched.dueDate && formik.errors.dueDate && (
              <p className="text-sm text-red-500">{formik.errors.dueDate}</p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="mb-2 block">Status</Label>
              <Select
                value={formik.values.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="mb-2 block">Priority</Label>
              <Select
                value={formik.values.priority}
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityList.map((option: Icommon) => (
                    <SelectItem key={option._id} value={option._id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1">
            <Label className="mb-2 block">Catagory</Label>
            <Select
              value={formik.values.catagory}
              onValueChange={(value) => handleSelectChange("catagory", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select catagory" />
              </SelectTrigger>
              <SelectContent>
                {catagoryList.map((option: Icommon) => (
                  <SelectItem key={option._id} value={option._id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUpdateSubmitting}>
              {editData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
