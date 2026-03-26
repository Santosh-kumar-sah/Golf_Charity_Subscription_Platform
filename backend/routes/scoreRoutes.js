import express from "express";

import {
  getScores,
  addScore,
  updateScore,
  deleteScore
} from "../controllers/scoreController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addScoreValidator } from "../validators/scoreValidator.js";

const router = express.Router();

router.get("/", authMiddleware, getScores);

router.post(
  "/",
  authMiddleware,
  addScoreValidator,
  validateRequest,
  addScore
);

router.put("/:id", authMiddleware, addScoreValidator, validateRequest, updateScore);
router.delete("/:id", authMiddleware, deleteScore);

export { router as scoreRoutes };