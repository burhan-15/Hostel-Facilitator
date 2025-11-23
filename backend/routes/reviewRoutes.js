import express from "express";
import {
  addReview,
  deleteReview,
  getReviews,
  getReviewsByUser,   // <-- NEW
} from "../controllers/reviewController.js";

import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get all reviews for a hostel (public)
router.get("/hostel/:id", getReviews);

// Add review (authenticated users only)
router.post("/hostel/:id", authenticate, authorize("user"), addReview);

// Delete review (admin or review owner)
router.delete("/hostel/:id/:reviewId", authenticate, deleteReview);

// ⭐ NEW: Get all reviews written by the logged-in user
router.get("/user/my-reviews", authenticate, getReviewsByUser);

export default router;
