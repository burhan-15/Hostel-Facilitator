import User from "../models/User.js";
import Hostel from "../models/Hostel.js";

// Add a hostel to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hostelId } = req.body;

    // Check if hostel exists
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }

    // Add to wishlist if not already added
    const user = await User.findById(userId);
    if (user.wishlist.includes(hostelId)) {
      return res.status(400).json({ success: false, message: "Hostel already in wishlist" });
    }

    user.wishlist.push(hostelId);
    await user.save();

    res.status(200).json({ success: true, message: "Hostel added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove a hostel from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hostelId } = req.params;

    const user = await User.findById(userId);
    if (!user.wishlist.includes(hostelId)) {
      return res.status(400).json({ success: false, message: "Hostel not in wishlist" });
    }

    user.wishlist = user.wishlist.filter(id => id.toString() !== hostelId);
    await user.save();

    res.status(200).json({ success: true, message: "Hostel removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all hostels in user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("wishlist");
    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
