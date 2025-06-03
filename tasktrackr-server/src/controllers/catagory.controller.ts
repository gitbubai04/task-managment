import { Request, Response } from "express";
import { ApiError } from "../utils/error.util";
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from "../constant/http.constant";
import { validateRequiredFields } from "../utils/validateRequiredFields";
import { categoryModel } from "../models/catagory.model";

export const createCatagoryController = async (req: Request, res: Response) => {
  try {
    const { userId: user_id } = res.locals;
    const { name, color } = req.body;
    const invalidField = validateRequiredFields(req.body, ["name", "color"]);
    if (invalidField) {
      throw new ApiError(
        HTTP_STATUSCODE.BAD_REQUEST,
        `Field ${invalidField} is required or invalid`
      );
    }

    const priority = await categoryModel.create({
      name,
      color,
      createdAt: new Date(),
      createdBy: user_id,
      updatedAt: new Date(),
    });
    if (!priority) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Priority not created!");
    }
    res.status(HTTP_STATUSCODE.CREATE).json({
      success: true,
      message: "Catagory created successfully",
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

// update Catagory by id
export const updateCatagoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: user_id } = res.locals;
    const { name, color } = req.body;
    const invalidField = validateRequiredFields(req.body, ["name", "color"]);
    if (invalidField) {
      throw new ApiError(
        HTTP_STATUSCODE.BAD_REQUEST,
        `Field ${invalidField} is required or invalid`
      );
    }

    const priority = await categoryModel.findByIdAndUpdate(
      { _id: id, is_deleted: false },
      {
        $set: {
          name,
          color,
          updatedAt: new Date(),
        },
      }
    );
    if (!priority) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Priority not found!");
    }
    res.status(HTTP_STATUSCODE.OK).json({
      success: true,
      message: "Catagory updated successfully",
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

// get all Catagory
export const getAllCatagoryController = async (req: Request, res: Response) => {
  try {
    const { userId: user_id } = res.locals;
    const priority = await categoryModel
      .find({
        is_deleted: false,
        createdBy: user_id,
      })
      .select("_id name color");
    if (!priority) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Priority not found!");
    }
    res.status(HTTP_STATUSCODE.OK).json({ success: true, data: priority });
  } catch (error: unknown | ApiError) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({
        success: false,
        message: HTTPS_MESSAGE.INTERNAL_ERROR,
      });
    }
  }
};

// delete Catagory by id
export const deleteCatagoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: user_id } = res.locals;

    const priority = await categoryModel.findByIdAndUpdate(
      { _id: id, is_deleted: false, createdBy: user_id },
      {
        $set: {
          is_deleted: true,
          deletedBy: user_id,
          deletedAt: new Date(),
        },
      }
    );
    if (!priority) {
      throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Priority not found!");
    }

    res.status(HTTP_STATUSCODE.OK).json({
      success: true,
      message: "Catagory deleted successfully",
    });
  } catch (error: unknown | ApiError) {
    if (error instanceof ApiError) {
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({
        success: false,
        message: HTTPS_MESSAGE.INTERNAL_ERROR,
      });
    }
  }
};
