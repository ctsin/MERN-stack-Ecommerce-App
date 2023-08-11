import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  queryCategoriesController,
} from "../controllers/categoryController.js";

const router = express.Router();
router.get("/", queryCategoriesController);
router.post("/create", createCategoryController);
router.delete("/delete/:id", deleteCategoryController);

export default router;
