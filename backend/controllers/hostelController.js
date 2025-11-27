import Hostel from "../models/Hostel.js";
import User from "../models/User.js";
import Sale from "../models/Sales.js";
import Visit from "../models/Visit.js";


// Get all hostels (with optional filters)
export const getAllHostels = async (req, res) => {
  try {
    const { status, area, gender, profession, minRent, maxRent } = req.query;

    const filter = {};

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

    let hostels = await Hostel.find(filter)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    const now = new Date();

    for (let h of hostels) {
      if (
        h.boost?.isActive &&
        h.boost?.endDate &&
        new Date(h.boost.endDate) < now
      ) {
        // Reset in database
        await Hostel.updateOne(
          { _id: h._id },
          {
            $set: {
              "boost.isActive": false,
              "boost.status": "none",
              "boost.durationDays": null,
              "boost.startDate": null,
              "boost.endDate": null
            }
          }
        );

        // Also update the local object so frontend receives updated values
        h.boost.isActive = false;
        h.boost.status = "none";
        h.boost.durationDays = null;
        h.boost.startDate = null;
        h.boost.endDate = null;
      }
    }


    hostels = hostels.sort((a, b) => {
      const aBoost = a.boost?.status === "approved";
      const bBoost = b.boost?.status === "approved";

      if (aBoost && !bBoost) return -1;
      if (!aBoost && bBoost) return 1;

      const aRating =
        a.reviews?.length > 0
          ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length
          : 0;

      const bRating =
        b.reviews?.length > 0
          ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length
          : 0;

      return bRating - aRating;
    });

    res.status(200).json({
      success: true,
      count: hostels.length,
      hostels,
    });
  } catch (error) {
    console.error("Get all hostels error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get hostel by ID
export const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findById(id).populate("ownerId", "name email");

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    if (
      (req.user?.role !== "admin" && req.user?.role !== "owner") &&
      hostel.status !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message: "Hostel not available",
      });
    }

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    console.error("Get hostel by ID error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create hostel
export const createHostel = async (req, res) => {
  try {
    const {
      name,
      area,
      rent,
      gender,
      profession,
      description,
      image,
      amenities,
      universitiesNearby,
      faqs,
      contact
    } = req.body;

    if (!name || !area || !rent || !gender || !profession || !description || !contact) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields, including contact number",
      });
    }

    const hostel = await Hostel.create({
      name,
      area,
      rent: Number(rent),
      gender,
      profession,
      description,
      contact: contact.trim(),
      image: image || "https://placehold.co/600x400/4f46e5/ffffff?text=Hostel+Image",
      amenities: amenities || [],
      nearbyUniversities: universitiesNearby || [],
      faqs: faqs || [],
      ownerId: req.user.userId,
      status: "pending",
    });

    const populatedHostel = await Hostel.findById(hostel._id).populate("ownerId", "name email");

    res.status(201).json({
      success: true,
      message: "Hostel created successfully. Waiting for admin approval.",
      hostel: populatedHostel,
    });
  } catch (error) {
    console.error("Create hostel error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update hostel
export const updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const hostel = await Hostel.findById(id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    if (hostel.ownerId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only update your own hostels",
      });
    }

    delete updates.status;

    if (updates.nearbyUniversities && !Array.isArray(updates.nearbyUniversities)) {
      return res.status(400).json({
        success: false,
        message: "nearbyUniversities must be an array.",
      });
    }

    if (updates.contact && typeof updates.contact !== "string") {
      return res.status(400).json({
        success: false,
        message: "Contact must be a valid string.",
      });
    }

    Object.assign(hostel, updates);
    await hostel.save();

    const updatedHostel = await Hostel.findById(id).populate("ownerId", "name email");

    res.status(200).json({
      success: true,
      message: "Hostel updated successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("Update hostel error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete hostel
export const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findById(id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    if (hostel.ownerId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own hostels",
      });
    }

    await Hostel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Hostel deleted successfully",
    });
  } catch (error) {
    console.error("Delete hostel error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Approve hostel
export const approveHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findById(id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reject hostel
export const rejectHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findById(id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    await Hostel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Hostel rejected and removed",
    });
  } catch (error) {
    console.error("Reject hostel error:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Increment hostel view count
export const increaseViewCount = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findByIdAndUpdate(
      id,
      { $inc: { views: 0.5 } },
      { new: true }
    ).populate("ownerId", "name email");

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    console.error("Increase view count error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add FAQ
export const addFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const hostel = await Hostel.findById(id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    if (hostel.ownerId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    hostel.faqs.push({ question, answer });
    await hostel.save();

    res.status(200).json({ success: true, message: "FAQ added", faqs: hostel.faqs });
  } catch (error) {
    console.error("Add FAQ error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update FAQ
export const updateFaq = async (req, res) => {
  try {
    const { id, faqId } = req.params;
    const { question, answer } = req.body;

    const hostel = await Hostel.findById(id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    const faq = hostel.faqs.id(faqId);
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });

    if (hostel.ownerId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    faq.question = question ?? faq.question;
    faq.answer = answer ?? faq.answer;

    await hostel.save();

    res.status(200).json({ success: true, message: "FAQ updated", faqs: hostel.faqs });
  } catch (error) {
    console.error("Update FAQ error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete FAQ
export const deleteFaq = async (req, res) => {
  try {
    const { id, faqId } = req.params;

    const hostel = await Hostel.findById(id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    hostel.faqs = hostel.faqs.filter((f) => f._id.toString() !== faqId);

    await hostel.save();

    res.status(200).json({ success: true, message: "FAQ deleted", faqs: hostel.faqs });
  } catch (error) {
    console.error("Delete FAQ error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const requestBoost = async (req, res) => {
  try {
    const { id } = req.params;
    const { durationDays } = req.body; // owner specifies number of days

    const hostel = await Hostel.findById(id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    if (hostel.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Only the owner can request a boost" });
    }

    if (!durationDays || durationDays <= 0) {
      return res.status(400).json({ success: false, message: "Please provide a valid boost duration in days" });
    }

    hostel.boost = {
      isActive: true, // boost is requested
      status: "pending",
      startDate: null, // will set on approval
      endDate: null,
      durationDays,
    };

    await hostel.save();

    res.status(200).json({ success: true, message: "Boost requested successfully", boost: hostel.boost });
  } catch (error) {
    console.error("Request boost error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

function calculateBoostPrice(days) {
  if(days <= 0) return 0;
  else if(days <= 7) return 500;
  else if(days <= 15) return 900;
  else return 1500;
}


export const approveBoost = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can approve boost" });
    }

    const hostel = await Hostel.findById(id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    if (!hostel.boost || hostel.boost.status !== "pending") {
      return res.status(400).json({ success: false, message: "No pending boost request found" });
    }

    const now = new Date();
    const durationMs = (hostel.boost.durationDays || 1) * 24 * 60 * 60 * 1000; // convert days to ms

    hostel.boost.status = "approved";
    hostel.boost.isActive = true;
    hostel.boost.startDate = now;
    hostel.boost.endDate = new Date(now.getTime() + durationMs);

    await hostel.save();

    const amount = calculateBoostPrice(hostel.boost.durationDays); 

    await Sale.create({
      hostelId: hostel._id,
      ownerId: hostel.ownerId,
      durationDays: hostel.boost.durationDays,
      amount,
      purchasedAt: new Date(),
    });

    res.status(200).json({ success: true, message: "Boost approved", boost: hostel.boost });
  } catch (error) {
    console.error("Approve boost error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const rejectBoost = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can reject boost" });
    }

    const hostel = await Hostel.findById(id);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    if (!hostel.boost) {
      return res.status(400).json({ success: false, message: "No pending boost request found" });
    }

    hostel.boost.isActive = false;
    hostel.boost.status = "pending";
    hostel.boost.startDate = null;
    hostel.boost.endDate = null;
    hostel.boost.durationDays = null;

    await hostel.save();

    res.status(200).json({ success: true, message: "Boost request rejected", boost: hostel.boost });
  } catch (error) {
    console.error("Reject boost error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const bookVisit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const hostelId = req.params.id;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Visit date is required",
      });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    const visit = await Visit.create({
      user: userId,
      owner: hostel.ownerId,
      hostel: hostelId,

      // ✅ FIXED: convert to real Date object (keeps your selected time)
      date: new Date(date),

      status: "pending",
      completed: false,
    });

    res.status(201).json({
      success: true,
      message: "Visit request sent",
      visit,
    });
  } catch (error) {
    console.error("Book visit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyVisitsForOwner = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const visits = await Visit.find({ owner: ownerId })
      .populate("user", "name email")
      .populate("hostel", "name area");

    res.status(200).json({
      success: true,
      visits,
    });
  } catch (error) {
    console.error("Fetch owner visits error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const approveVisit = async (req, res) => {
  try {
    const visitId = req.params.visitId;

    const visit = await Visit.findById(visitId);
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    visit.status = "approved";
    await visit.save();

    res.status(200).json({
      success: true,
      message: "Visit approved",
      visit,
    });
  } catch (error) {
    console.error("Approve visit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const cancelVisit = async (req, res) => {
  try {
    const visitId = req.params.visitId;

    const visit = await Visit.findById(visitId);
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    visit.status = "cancelled";
    await visit.save();

    res.status(200).json({
      success: true,
      message: "Visit cancelled",
      visit,
    });
  } catch (error) {
    console.error("Cancel visit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const completeVisit = async (req, res) => {
  try {
    const visitId = req.params.visitId;

    const visit = await Visit.findById(visitId);
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    if (visit.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Visit must be approved before marking complete",
      });
    }

    visit.completed = true;
    visit.status = "completed";
    await visit.save();

    res.status(200).json({
      success: true,
      message: "Visit marked as completed",
      visit,
    });
  } catch (error) {
    console.error("Complete visit error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyVisitsForUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const visits = await Visit.find({ user: userId })
      .populate("hostel", "name area image rent gender")
      .sort({ createdAt: -1 });

    res.json({ success: true, visits });
  } catch (err) {
    console.error("Error getting user visits:", err);
    res.status(500).json({ success: false, message: "Failed to fetch visits" });
  }
};

