// routes/faqRoutes.js
import express from "express";
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "../controllers/faqController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public: list faqs
router.get("/", getFAQs);

// Admin routes
router.post("/", authenticate, authorize("admin"), createFAQ);
router.put("/:id", authenticate, authorize("admin"), updateFAQ);
router.delete("/:id", authenticate, authorize("admin"), deleteFAQ);

export default router;
