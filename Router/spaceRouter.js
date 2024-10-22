import express from "express";
import { requireSign } from "../Middlewares/authMiddle.js";
import { verifyPassword } from "../Middlewares/verifyMiddlewares.js";
import {
  createSpaceController,
  getSpaceByIdController,
  getAllSpacesController,
  updateSpaceController,
  deleteSpaceController,
} from "../Controller/spaceController.js";

// Router object
const router = express.Router();

// Public routes
router.post("/create", requireSign, createSpaceController);
router.get("/:id", requireSign, getSpaceByIdController);
router.get("/", requireSign, getAllSpacesController);

// Protected routes with double verification
router.put("/:id", requireSign, verifyPassword, updateSpaceController);
router.delete("/:id", requireSign, verifyPassword, deleteSpaceController);

export default router;
