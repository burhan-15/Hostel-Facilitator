import Hostel from "../models/Hostel.js";

// Add review to hostel
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating must be between 1 and 5" 
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Review text is required" 
      });
    }

    const hostel = await Hostel.findById(id);
    
    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    // Check if user has already reviewed this hostel
    const existingReview = hostel.reviews.find(
      (r) => r.userId.toString() === req.user.userId
    );

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already reviewed this hostel" 
      });
    }

    // Add review
    hostel.reviews.push({
      userId: req.user.userId,
      rating: Number(rating),
      text: text.trim(),
    });

    await hostel.save();

    const updatedHostel = await Hostel.findById(id)
      .populate("ownerId", "name email")
      .populate("reviews.userId", "name");

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Delete review (admin only, or user who wrote it)
export const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const hostel = await Hostel.findById(id);
    
    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    // Find review
    const review = hostel.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: "Review not found" 
      });
    }

    // Check permissions: admin can delete any review, user can only delete their own
    if (
      req.user.role !== "admin" &&
      review.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to delete this review" 
      });
    }

    // Remove review
    hostel.reviews.pull(reviewId);
    await hostel.save();

    const updatedHostel = await Hostel.findById(id)
      .populate("ownerId", "name email");

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Get all reviews for a hostel
export const getReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findById(id)
      .populate("reviews.userId", "name email")
      .select("reviews");

    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    res.status(200).json({
      success: true,
      reviews: hostel.reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

