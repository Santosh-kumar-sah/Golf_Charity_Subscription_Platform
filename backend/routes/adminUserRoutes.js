import express from "express";
import { getAllUsers, updateUser,updateScore,deleteScore } from "../controllers/adminUserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware); // JWT auth middleware that sets req.user

router.get("/users", getAllUsers);
router.patch("/users/:id", updateUser);
router.patch("/scores/:id", updateScore);
router.delete("/scores/:id", deleteScore);




export { router as adminUserRoutes };