// src/services/salesService.js
import API from "../api"; // your configured axios instance

// Get sales stats (Admin only)
export const getSalesStats = async () => {
  try {
    const res = await API.get("/sales/stats");
    return res.data; 
  } catch (err) {
    console.error("getSalesStats error:", err);
    throw err;
  }
};

