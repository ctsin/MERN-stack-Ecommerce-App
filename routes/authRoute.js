import express from "express";
import {
  loginController,
  registerController,
  resetController,
  testController,
} from "../controllers/userController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/reset", resetController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ success: true });
});
router.get("/test", requireSignIn, testController);

export default router;
