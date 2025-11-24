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
  increaseViewCount,
  addFaq,
  updateFaq,
  deleteFaq,
  requestBoost,
  approveBoost,
  rejectBoost,
} from "../controllers/hostelController.js";

import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Admin all hostels
router.get("/admin", authenticate, authorize("admin"), getAllHostels);

// Public routes
router.get("/", getAllHostels);
router.get("/:id", getHostelById);
router.patch("/:id/views", increaseViewCount);

// Protected routes
router.post("/", authenticate, authorize("owner"), createHostel);
router.put("/:id", authenticate, updateHostel);
router.delete("/:id", authenticate, deleteHostel);

// Owner-specific hostels
router.get("/owner/my-hostels", authenticate, authorize("owner"), getHostelsByOwner);

// Admin approval routes
router.patch("/:id/approve", authenticate, authorize("admin"), approveHostel);
router.patch("/:id/reject", authenticate, authorize("admin"), rejectHostel);

// Boost routes
router.post("/:id/boost", authenticate, authorize("owner"), requestBoost); // owner requests boost
router.patch("/:id/boost/approve", authenticate, authorize("admin"), approveBoost); // admin approves boost
router.patch("/:id/boost/reject", authenticate, authorize("admin"), rejectBoost); // admin rejects boost


// Add FAQ
router.post("/:id/faqs", authenticate, authorize("owner"), addFaq);

// Update FAQ
router.patch("/:id/faqs/:faqId", authenticate, authorize("owner"), updateFaq);

// Delete FAQ
router.delete("/:id/faqs/:faqId", authenticate, authorize("owner"), deleteFaq);



export default router;
