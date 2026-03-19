import express from "express";
import { getInstructorDashboard, getLearnerDashboard } from "../controllers/dashboardController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/learner", optionalProtect, asyncHandler(getLearnerDashboard));
router.get("/instructor", optionalProtect, asyncHandler(getInstructorDashboard));

export default router;
