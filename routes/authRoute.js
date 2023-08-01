import express from "express";
import {
  loginController,
  registerController,
  resetController,
  testController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

// what's the difference between router and app.get()
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/reset", resetController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ success: true });
});
router.get("/test", requireSignIn, isAdmin, testController);

export default router;
