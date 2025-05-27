import { Request, Response } from "express";
import { ApiError } from "../utils/error.util";
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from "../constant/http.constant";
import { validateRequiredFields } from "../utils/validateRequiredFields";
import taskModel from "../models/task.model";
import { TASK_STATUS } from "../constant/enum";
import priorityModel from "../models/priority.model";
import { categoryModel } from "../models/catagory.model";

// create Task
export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { userId: user_id } = res.locals;
    const { title, description, dueDate, priority, status, catagory } =
      req.body;
    const invalidField = validateRequiredFields(req.body, ["title", "status"]);

    if (invalidField) {
      throw new ApiError(
        HTTP_STATUSCODE.BAD_REQUEST,
        `Field ${invalidField} is required or invalid`
      );
    }

    if (!TASK_STATUS.includes(status)) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Invalid status!");
    }

    const priorityExists = priorityModel.findOne({ _id: priority });
    if (!priorityExists) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Invalid priority!");
    }

    const catagoryExists = categoryModel.findOne({ _id: catagory });
    if (!catagoryExists) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Invalid catagory!");
    }

    const task = await taskModel.create({
      title,
      description: description || "",
      dueDate: dueDate || null,
      priority,
      status,
      catagory,
      createdBy: user_id,
      createdAt: new Date(),
    });

    if (!task) {
      throw new ApiError(
        HTTP_STATUSCODE.INTERNAL_ERROR,
        HTTPS_MESSAGE.INTERNAL_ERROR
      );
    }

    res.status(HTTP_STATUSCODE.CREATE).json({
      success: true,
      message: "Task created successfully",
    });
  } catch (error: unknown | ApiError) {
    if (error instanceof ApiError) {
      res.status(error.status).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({
        success: false,
        message: HTTPS_MESSAGE.INTERNAL_ERROR,
      });
    }
  }
};

// get all group tasks
export const getAllTaskGroupController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId: user_id } = res.locals;
    const tasks = await taskModel.aggregate([
      { $match: { is_deleted: false, createdBy: user_id } },
      {
        $lookup: {
          from: "Category",
          let: { catId: "$catagory" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$catId"] } } },
            { $project: { _id: 1, name: 1, color: 1 } },
          ],
          as: "category_details",
        },
      },
      {
        $lookup: {
          from: "Priority",
          let: { priorityId: "$priority" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$priorityId"] } } },
            { $project: { _id: 1, name: 1, color: 1 } },
          ],
          as: "priority_details",
        },
      },
      { $unwind: "$category_details" },
      { $unwind: "$priority_details" },
      //   { $project: { category_details: 1, priority_details: 1, status: 1, } }
    ]);
    const groupedTasks: Record<string, typeof tasks> = {};
    for (const status of TASK_STATUS) {
      groupedTasks[status] = [];
    }

    for (const task of tasks) {
      const status = task.status;
      if (groupedTasks[status]) {
        groupedTasks[status].push(task);
      }
    }

    res.status(200).json({
      success: true,
      data: groupedTasks,
    });
  } catch (error: unknown | ApiError) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_STATUSCODE.INTERNAL_ERROR)
        .json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
    }
  }
};

export const getAllTaskController = async (req: Request, res: Response) => {
  try {
    const { userId: user_id } = res.locals;
    const tasks = await taskModel
      .find({ is_deleted: false, createdBy: user_id })
      .sort({ createdAt: -1 });
    res.status(HTTP_STATUSCODE.OK).json({ success: true, data: tasks });
  } catch (error: unknown | ApiError) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_STATUSCODE.INTERNAL_ERROR)
        .json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
    }
  }
};

// update task by id
export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: user_id } = res.locals;
    const { title, description, dueDate, priority, status, catagory } =
      req.body;

    const invalidField = validateRequiredFields(req.body, ["title", "status"]);

    if (invalidField) {
      throw new ApiError(
        HTTP_STATUSCODE.BAD_REQUEST,
        `Field ${invalidField} is required or invalid`
      );
    }

    if (!TASK_STATUS.includes(status)) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Invalid status!");
    }

    const priorityExists = priorityModel.findOne({ _id: priority });
    if (!priorityExists) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Invalid priority!");
    }

    const catagoryExists = categoryModel.findOne({ _id: catagory });
    if (!catagoryExists) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Invalid catagory!");
    }

    const task = await taskModel.findByIdAndUpdate(
      { _id: id, is_deleted: false, createdBy: user_id },
      {
        title,
        description: description || "",
        dueDate: dueDate || null,
        priority,
        status,
        catagory,
        updatedBy: user_id,
        updatedAt: new Date(),
      }
    );
    if (!task) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Task not found!");
    }

    res.status(HTTP_STATUSCODE.OK).json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error: unknown | ApiError) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_STATUSCODE.INTERNAL_ERROR)
        .json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
    }
  }
};

// get task by id
export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: user_id } = res.locals;
    const task = await taskModel.findById({
      _id: id,
      is_deleted: false,
      createdBy: user_id,
    });
    if (!task) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Task not found!");
    }
    res.status(HTTP_STATUSCODE.OK).json({ success: true, data: task });
  } catch (error: unknown | ApiError) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_STATUSCODE.INTERNAL_ERROR)
        .json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
    }
  }
};

// change status by id
export const changeStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: user_id } = res.locals;
    const { status } = req.body;

    if (!TASK_STATUS.includes(status)) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Invalid status!");
    }

    const task = await taskModel.findByIdAndUpdate(
      { _id: id, is_deleted: false, createdBy: user_id },
      {
        $set: {
          status,
          updatedBy: user_id,
          updatedAt: new Date(),
        },
      }
    );
    if (!task) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Task not found!");
    }

    res.status(HTTP_STATUSCODE.OK).json({
      success: true,
      message: "Task status change to " + status,
    });
  } catch (error: unknown | ApiError) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_STATUSCODE.INTERNAL_ERROR)
        .json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
    }
  }
};

// delete task by id
export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: user_id } = res.locals;

    const task = await taskModel.findByIdAndUpdate(
      { _id: id, is_deleted: false, createdBy: user_id },
      {
        $set: {
          is_deleted: true,
          deletedBy: user_id,
          deletedAt: new Date(),
        },
      }
    );
    if (!task) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Task not found!");
    }

    res.status(HTTP_STATUSCODE.OK).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: unknown | ApiError) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_STATUSCODE.INTERNAL_ERROR)
        .json({ success: false, message: HTTPS_MESSAGE.INTERNAL_ERROR });
    }
  }
};
