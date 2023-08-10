import express from "express";
import {
  createPostController,
  queryLatestController,
  queryPostsController,
} from "../controllers/postController.js";

const router = express.Router();
router.post("/create", createPostController);
router.get("/", queryPostsController);
router.get("/latest", queryLatestController);

export default router;
