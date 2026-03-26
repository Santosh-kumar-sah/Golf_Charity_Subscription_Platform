import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getMe
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator
} from "../validators/authValidator.js";

import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validateRequest,
  registerUser
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  loginUser
);

router.post(
  "/logout",
  authMiddleware,
  logoutUser
);

router.get(
  "/me",
  authMiddleware,
  getMe
);

export { router as authRoutes };