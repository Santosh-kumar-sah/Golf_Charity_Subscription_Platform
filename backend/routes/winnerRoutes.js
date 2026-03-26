import express from "express";
import { upload, validateFileUpload } from "../middleware/multerMiddleware.js";
import {
  uploadProof,
  getMyWinnings,
} from "../controllers/winnerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getAllWinners, updateWinnerStatus, markPayment } from "../controllers/winnerController.js";
const router = express.Router();

// User: Get my winnings
router.get("/my", authMiddleware, getMyWinnings);

// User: Upload proof with file validation
router.post(
  "/upload-proof/:winnerId",
  authMiddleware,
  upload.single("proof"),
  validateFileUpload,
  uploadProof
);

// Admin: Get all winners
router.get("/winners", authMiddleware, getAllWinners);

// Admin: Update winner status (approve/reject)
router.patch("/:id/status", authMiddleware, updateWinnerStatus);

// Admin: Mark payment as paid
router.patch("/:id/payment", authMiddleware, markPayment);

export { router as winnerRoutes };