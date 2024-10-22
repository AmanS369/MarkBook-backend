import express from "express";
import { requireSign } from "../middlewares/authMiddle.js"; // Ensure this middleware is defined
import {
  createBitController,
  getBitByIdController,
  getAllBitsController,
  updateBitController,
  deleteBitController,
} from "../Controller/bitsController.js"; // Adjust the import path as needed

// Router object
const router = express.Router();

// Public routes
router.post("/create-bit", requireSign, createBitController);
router.get("/:id", requireSign, getBitByIdController);
router.get("/", requireSign, getAllBitsController);

// Protected routes
router.put("/:id", requireSign, updateBitController);
router.delete("/:id", requireSign, deleteBitController);

export default router;
