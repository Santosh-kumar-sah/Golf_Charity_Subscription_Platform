import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  createSubscription,
  getMySubscription,
  cancelSubscription
} from "../controllers/subscriptionController.js";

const router = express.Router();

// ============================
// USER SUBSCRIPTIONS
// ============================

// User creates a subscription (monthly/yearly)
router.post("/", authMiddleware, createSubscription);

// User fetches their subscription
router.get("/me", authMiddleware, getMySubscription);

// User cancels their subscription
router.patch("/:id/cancel", authMiddleware, cancelSubscription);

export { router as subscriptionRouter };