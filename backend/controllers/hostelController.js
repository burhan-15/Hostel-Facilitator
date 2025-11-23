import Hostel from "../models/Hostel.js";
import User from "../models/User.js";

// Get all hostels (with optional filters)
export const getAllHostels = async (req, res) => {
  try {
    const { status, area, gender, profession, minRent, maxRent } = req.query;
    
    // Build filter object
    const filter = {};
    
    // If user is not admin, only show approved hostels
    if (req.user?.role !== "admin") {
      filter.status = "approved";
    }
    


    if (area) filter.area = area;
    if (gender) filter.gender = gender;
    if (profession) filter.profession = profession;
    
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    const hostels = await Hostel.find(filter)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hostels.length,
      hostels,
    });
  } catch (error) {
    console.error("Get all hostels error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Get single hostel by ID
export const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hostel = await Hostel.findById(id).populate("ownerId", "name email");
    
    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    // Only show approved hostels to non-admin users
    if (req.user?.role !== "admin" && hostel.status !== "approved") {
      return res.status(403).json({ 
        success: false, 
        message: "Hostel not available" 
      });
    }

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    console.error("Get hostel by ID error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Create new hostel (owner only)
export const createHostel = async (req, res) => {
  try {
    const { name, area, rent, gender, profession, description, image, amenities } = req.body;

    // Validate required fields
    if (!name || !area || !rent || !gender || !profession || !description) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required fields" 
      });
    }

    // Create hostel
    const hostel = await Hostel.create({
      name,
      area,
      rent: Number(rent),
      gender,
      profession,
      description,
      image: image || "https://placehold.co/600x400/4f46e5/ffffff?text=Hostel+Image",
      amenities: amenities || [],
      ownerId: req.user.userId,
      status: "pending", // New hostels need admin approval
    });

    const populatedHostel = await Hostel.findById(hostel._id)
      .populate("ownerId", "name email");

    res.status(201).json({
      success: true,
      message: "Hostel created successfully. Waiting for admin approval.",
      hostel: populatedHostel,
    });
  } catch (error) {
    console.error("Create hostel error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Update hostel (owner only, can only update their own hostels)
export const updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const hostel = await Hostel.findById(id);
    
    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    // Check if user is the owner or admin
    if (hostel.ownerId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "You can only update your own hostels" 
      });
    }

    // Don't allow status changes through regular update (use approve/reject endpoints)
    delete updates.status;

    // Update hostel
    Object.assign(hostel, updates);
    await hostel.save();

    const updatedHostel = await Hostel.findById(id)
      .populate("ownerId", "name email");

    res.status(200).json({
      success: true,
      message: "Hostel updated successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("Update hostel error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Delete hostel (owner or admin)
export const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findById(id);
    
    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    // Check if user is the owner or admin
    if (hostel.ownerId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "You can only delete your own hostels" 
      });
    }

    await Hostel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Hostel deleted successfully",
    });
  } catch (error) {
    console.error("Delete hostel error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Approve hostel (admin only)
export const approveHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findById(id);
    
    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    hostel.status = "approved";
    await hostel.save();

    const updatedHostel = await Hostel.findById(id)
      .populate("ownerId", "name email");

    res.status(200).json({
      success: true,
      message: "Hostel approved successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("Approve hostel error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Reject hostel (admin only)
export const rejectHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findById(id);
    
    if (!hostel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hostel not found" 
      });
    }

    // Delete the hostel (or set status to rejected if you want to keep it)
    await Hostel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Hostel rejected and removed",
    });
  } catch (error) {
    console.error("Reject hostel error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Get hostels by owner
export const getHostelsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const hostels = await Hostel.find({ ownerId })
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hostels.length,
      hostels,
    });
  } catch (error) {
    console.error("Get hostels by owner error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};


