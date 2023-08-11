import express from "express";
import {
  createPostController,
  queryLatestController,
  queryPostsController,
  updatePostController,
} from "../controllers/postController.js";

const router = express.Router();
router.get("/", queryPostsController);
router.post("/create", createPostController);
router.patch("/update/:postID-:categoryID", updatePostController);
router.get("/latest", queryLatestController);

export default router;
