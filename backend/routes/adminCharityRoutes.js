import express from "express";
import { addCharity, editCharity, deleteCharity, listCharities } from "../controllers/adminCharityController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload, validateFileUpload } from "../middleware/multerMiddleware.js";
const router = express.Router();

// ✅ Upload routes with file validation middleware
router.post("/charities", authMiddleware, upload.single("image"), validateFileUpload, addCharity);
router.put("/charities/:id", authMiddleware, upload.single("image"), validateFileUpload, editCharity);
router.delete("/charities/:id", authMiddleware, deleteCharity);
router.get("/charities", authMiddleware, listCharities);

export { router as adminCharityRoutes };