import express from "express";
import { getCourseBySlug, getCourses, updateCourseProgress } from "../controllers/courseController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { optionalProtect, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", asyncHandler(getCourses));
router.get("/:courseId", optionalProtect, asyncHandler(getCourseBySlug));
router.post("/:courseId/progress", protect, asyncHandler(updateCourseProgress));

export default router;
