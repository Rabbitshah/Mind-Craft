import express from "express";
import {
  checkout,
  getLatestOrderController,
  getOrderHistoryController,
} from "../controllers/orderController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", optionalProtect, asyncHandler(checkout));
router.get("/", optionalProtect, asyncHandler(getOrderHistoryController));
router.get("/latest", optionalProtect, asyncHandler(getLatestOrderController));

export default router;
