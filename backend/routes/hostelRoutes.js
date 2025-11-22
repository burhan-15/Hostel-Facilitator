import express from "express";
import {
  getAllHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
  approveHostel,
  rejectHostel,
  getHostelsByOwner,
  addQuestion,
  answerQuestion,
} from "../controllers/hostelController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/", getAllHostels);
router.get("/:id", getHostelById);

// Protected routes
router.post("/", authenticate, authorize("owner", "admin"), createHostel);
router.put("/:id", authenticate, updateHostel);
router.delete("/:id", authenticate, deleteHostel);

// Owner routes
router.get("/owner/my-hostels", authenticate, authorize("owner", "admin"), getHostelsByOwner);

// Admin routes
router.patch("/:id/approve", authenticate, authorize("admin"), approveHostel);
router.patch("/:id/reject", authenticate, authorize("admin"), rejectHostel);

// Question routes
router.post("/:id/questions", authenticate, addQuestion);
router.post("/:id/questions/:questionId/answer", authenticate, authorize("owner", "admin"), answerQuestion);

export default router;

