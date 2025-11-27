import Sale from "../models/Sales.js";

export const getSalesStats = async (req, res) => {
  try {
    // Only admin can view stats
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can view sales stats" });
    }

    // Total revenue (sum of all sales)
    const totalRevenue = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Total number of boost purchases
    const totalBoostsSold = await Sale.countDocuments();

    // Monthly revenue breakdown
    const monthlyRevenue = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          boostCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.status(200).json({
      success: true,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalBoostsSold,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Sales stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
