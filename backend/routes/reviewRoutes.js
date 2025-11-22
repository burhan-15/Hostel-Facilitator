import express from "express";
import {
  addReview,
  deleteReview,
  getReviews,
} from "../controllers/reviewController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get all reviews for a hostel (public)
router.get("/hostel/:id", getReviews);

// Add review (authenticated users only)
router.post("/hostel/:id", authenticate, authorize("user"), addReview);

// Delete review (admin or review owner)
router.delete("/hostel/:id/:reviewId", authenticate, deleteReview);

export default router;

