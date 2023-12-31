import express from "express";
import {
  addCategoryController,
  createPostController,
  deletePostController,
  queryLatestController,
  queryPostsController,
  removeCategoryController,
} from "../controllers/postController.js";

const router = express.Router();
router.get("/", queryPostsController);
router.post("/create", createPostController);
router.post("/delete/:postID", deletePostController);
router.patch("/remove/:postID-:categoryID", removeCategoryController);
router.patch("/add/:postID-:category", addCategoryController);
router.get("/latest", queryLatestController);

export default router;
