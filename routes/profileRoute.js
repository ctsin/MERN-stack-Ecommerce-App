import express from "express";
import { createProfileController } from "../controllers/profileController.js";

const router = express.Router();

router.post("/create", createProfileController);

export default router;
