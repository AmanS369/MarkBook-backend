import express from "express";
import { requireSign } from "../Middlewares/authMiddle.js";
import {
  createQuickBitController,
  getQuickBitsController,
} from "../Controller/quickBitController.js";

const router = express.Router();

// Create a Quick Bit
router.post("/create-quick-bit", requireSign, createQuickBitController);

// Get all Quick Bits
router.get("/get-quick-bits", requireSign, getQuickBitsController);

export default router;
