import express from "express";
import { searchController } from "../Controller/searchController.js";
import { requireSign } from "../Middlewares/authMiddle.js";

const router = express.Router();

router.get("/", requireSign, searchController);

export default router;
