import express from "express";
import { updateUserCharity,getUserCharity } from "../controllers/userController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

// User selects charity
router.patch("/charity", authMiddleware, updateUserCharity);
router.get("/charity", authMiddleware, getUserCharity);

export  {router as userRoutes};