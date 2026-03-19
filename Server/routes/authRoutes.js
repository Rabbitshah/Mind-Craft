import express from "express";
import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", asyncHandler(logoutUser));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.get("/me", protect, asyncHandler(getCurrentUser));

export default router;
