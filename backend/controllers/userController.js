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

    // Increment shortlists
    hostel.shortlists = (hostel.shortlists || 0) + 1;
    await hostel.save();

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

    // Decrement shortlists
    const hostel = await Hostel.findById(hostelId);
    if (hostel && hostel.shortlists > 0) {
      hostel.shortlists -= 1;
      await hostel.save();
    }

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

export const addToCompare = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hostelId } = req.body;

    // Check hostel exists
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }

    const user = await User.findById(userId);

    // Prevent duplicates
    if (user.compareList.includes(hostelId)) {
      return res.status(400).json({ success: false, message: "Already added to compare" });
    }

    // Allow only 2 hostels
    if (user.compareList.length >= 2) {
      return res.status(400).json({
        success: false,
        message: "You can only compare 2 hostels at a time",
      });
    }

    user.compareList.push(hostelId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Hostel added to compare list",
      compareList: user.compareList,
    });

  } catch (error) {
    console.error("Add to compare error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const removeFromCompare = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hostelId } = req.params;

    const user = await User.findById(userId);

    if (!user.compareList.includes(hostelId)) {
      return res.status(400).json({ success: false, message: "Hostel not in compare list" });
    }

    user.compareList = user.compareList.filter(id => id.toString() !== hostelId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Hostel removed from compare list",
      compareList: user.compareList,
    });

  } catch (error) {
    console.error("Remove compare error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCompareList = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("compareList");

    res.status(200).json({
      success: true,
      compareList: user.compareList,
      count: user.compareList.length,
    });

  } catch (error) {
    console.error("Get compare list error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const compareHostels = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("compareList");

    const count = user.compareList.length;

    // CASE 0: Empty list
    if (count === 0) {
      return res.status(200).json({
        success: true,
        comparison: null,
      });
    }

    // CASE 1: One hostel only
    if (count === 1) {
      const h1 = user.compareList[0];

      return res.status(200).json({
        success: true,
        comparison: {
          hostel1: {
            _id: h1._id,
            name: h1.name,
            area: h1.area,
            rent: h1.rent,
            gender: h1.gender,
            profession: h1.profession,
            amenities: h1.amenities,
            reviews: h1.reviews,
            shortlists: h1.shortlists,
            image: h1.image,
          },
          hostel2: null,
        },
      });
    }

    // CASE 2: Normal comparison
    const [h1, h2] = user.compareList;

    return res.status(200).json({
      success: true,
      comparison: {
        hostel1: {
          _id: h1._id,
          name: h1.name,
          area: h1.area,
          rent: h1.rent,
          gender: h1.gender,
          profession: h1.profession,
          amenities: h1.amenities,
          reviews: h1.reviews,
          shortlists: h1.shortlists,
          image: h1.image,
        },
        hostel2: {
          _id: h2._id,
          name: h2.name,
          area: h2.area,
          rent: h2.rent,
          gender: h2.gender,
          profession: h2.profession,
          amenities: h2.amenities,
          reviews: h2.reviews,
          shortlists: h2.shortlists,
          image: h2.image,
        },
      },
    });

  } catch (error) {
    console.error("Compare hostels error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const clearCompareList = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    user.compareList = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Compare list cleared",
    });

  } catch (error) {
    console.error("Clear compare error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
