import express from "express";
import { getSalesStats } from "../controllers/salesController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Admin-only: view total sales + monthly revenue stats
router.get("/stats", authenticate, authorize("admin"), getSalesStats);

export default router;
