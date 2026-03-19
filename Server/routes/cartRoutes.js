import express from "express";
import {
  addCartItem,
  applyPromo,
  clearPromo,
  getCart,
  removeCartItem,
} from "../controllers/cartController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, asyncHandler(getCart));
router.post("/items", optionalProtect, asyncHandler(addCartItem));
router.delete("/items/:courseId", optionalProtect, asyncHandler(removeCartItem));
router.post("/promo", optionalProtect, asyncHandler(applyPromo));
router.delete("/promo", optionalProtect, asyncHandler(clearPromo));

export default router;
