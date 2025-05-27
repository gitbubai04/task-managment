import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createPriorityController,
  deletePriorityController,
  getAllPriorityController,
  updatePriorityController,
} from "../controllers/priority.controller";

const priorityRouter = express.Router();

priorityRouter.post("/add", authMiddleware, createPriorityController);
priorityRouter.get("/all", authMiddleware, getAllPriorityController);
priorityRouter.put("/update/:id", authMiddleware, updatePriorityController);
priorityRouter.delete("/delete/:id", authMiddleware, deletePriorityController);

export default priorityRouter;
