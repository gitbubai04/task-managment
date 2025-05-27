import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createCatagoryController,
  getAllCatagoryController,
  updateCatagoryController,
  deleteCatagoryController,
} from "../controllers/catagory.controller";

const catagoryRouter = express.Router();

catagoryRouter.post("/add", authMiddleware, createCatagoryController);
catagoryRouter.get("/all", authMiddleware, getAllCatagoryController);
catagoryRouter.put("/update/:id", authMiddleware, updateCatagoryController);
catagoryRouter.delete("/delete/:id", authMiddleware, deleteCatagoryController);

export default catagoryRouter;
