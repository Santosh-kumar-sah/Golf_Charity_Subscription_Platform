import express from "express";
import { getAdminReports } from "../controllers/reportController.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Admin-only access
router.get("/", asyncHandler(getAdminReports));

export  {router as reportRoutes};