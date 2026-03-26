import express from "express";
import { simulateDraw,getAllDraws,publishDraw,getAllDrawResults,calculatePrizePool,getPrizePools ,getAllPublicDraws} from "../controllers/drawController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/public", authMiddleware, getAllPublicDraws);
// Only admins can simulate a draw
router.post("/draws/simulate", authMiddleware, adminMiddleware, simulateDraw);
router.get("/draws", authMiddleware, adminMiddleware, getAllDraws);
router.post("/draws/:id/publish", authMiddleware, adminMiddleware, publishDraw);
router.get("/draw_results", authMiddleware, adminMiddleware, getAllDrawResults);

router.post("/draws/:draw_id/prize-pool", authMiddleware, adminMiddleware, calculatePrizePool);
router.get("/draws/prize-pools", authMiddleware, adminMiddleware, getPrizePools);
export { router as adminRoutes };