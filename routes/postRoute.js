import express from "express";
import {
  createPostController,
  queryLatestController,
  queryPostController,
  queryPostsController,
} from "../controllers/postController.js";

const router = express.Router();
router.post("/create", createPostController);
router.get("/", queryPostsController);
router.get("/post/:id", queryPostController);
router.get("/latest", queryLatestController);

export default router;
