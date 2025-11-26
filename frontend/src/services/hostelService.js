import API from "../api";

export const getHostels = async () => {
  try {
    const res = await API.get("/hostels");
    return res.data.hostels || [];
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return [];
  }
};

export const getAllHostels = async () => {
  try {
    const res = await API.get("/hostels/admin");
    return res.data.hostels || [];
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return [];
  }
};

export const getHostelById = async (id) => {
  try {
    const res = await API.get(`/hostels/${id}`);
    return res.data.hostel;
  } catch (error) {
    console.error("Error fetching hostel:", error);
    throw error;
  }
};

export const createHostel = async (hostelData) => {
  try {
    const res = await API.post("/hostels", hostelData);
    return res.data;
  } catch (error) {
    console.error("Error creating hostel:", error);
    throw error;
  }
};

export const updateHostel = async (id, hostelData) => {
  try {
    const res = await API.put(`/hostels/${id}`, hostelData);
    return res.data;
  } catch (error) {
    console.error("Error updating hostel:", error);
    throw error;
  }
};

export const deleteHostel = async (id) => {
  try {
    const res = await API.delete(`/hostels/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting hostel:", error);
    throw error;
  }
};

export const getMyHostels = async () => {
  try {
    const res = await API.get("/hostels/owner/my-hostels");
    return res.data.hostels || [];
  } catch (error) {
    console.error("Error fetching my hostels:", error);
    return [];
  }
};

export const approveHostel = async (id) => {
  try {
    const res = await API.patch(`/hostels/${id}/approve`);
    return res.data;
  } catch (error) {
    console.error("Error approving hostel:", error);
    throw error;
  }
};

export const rejectHostel = async (id) => {
  try {
    const res = await API.patch(`/hostels/${id}/reject`);
    return res.data;
  } catch (error) {
    console.error("Error rejecting hostel:", error);
    throw error;
  }
};

export const addQuestion = async (hostelId, text) => {
  try {
    const res = await API.post(`/hostels/${hostelId}/questions`, { text });
    return res.data;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

export const answerQuestion = async (hostelId, questionId, answer) => {
  try {
    const res = await API.post(`/hostels/${hostelId}/questions/${questionId}/answer`, { answer });
    return res.data;
  } catch (error) {
    console.error("Error answering question:", error);
    throw error;
  }
};

// Review functions
export const addReview = async (hostelId, rating, text) => {
  try {
    const res = await API.post(`/reviews/hostel/${hostelId}`, { rating, text });
    return res.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const deleteReview = async (hostelId, reviewId) => {
  try {
    const res = await API.delete(`/reviews/hostel/${hostelId}/${reviewId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

export const getReviews = async (hostelId) => {
  try {
    const res = await API.get(`/reviews/hostel/${hostelId}`);
    return res.data.reviews || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// Increment hostel view count
export const incrementViewCount = async (hostelId) => {
  try {
    const res = await API.patch(`/hostels/${hostelId}/views`);
    return res.data;
  } catch (error) {
    console.error("Error incrementing view count:", error);
    // optional: don't throw, just fail silently to not break page load
    return null;
  }
};

// Add a new FAQ (owner only)
export const addFaq = async (hostelId, question, answer) => {
  try {
    const res = await API.post(`/hostels/${hostelId}/faqs`, { question, answer });
    return res.data;
  } catch (error) {
    console.error("Error adding FAQ:", error);
    throw error;
  }
};

// Update an existing FAQ (owner only)
export const updateFaq = async (hostelId, faqId, question, answer) => {
  try {
    const res = await API.patch(`/hostels/${hostelId}/faqs/${faqId}`, { question, answer });
    return res.data;
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
};

// Delete an FAQ (owner only)
export const deleteFaq = async (hostelId, faqId) => {
  try {
    const res = await API.delete(`/hostels/${hostelId}/faqs/${faqId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
};

// Owner requests a boost
export const requestBoost = async (hostelId, durationDays) => {
  try {
    const res = await API.post(`/hostels/${hostelId}/boost`, { durationDays });
    return res.data;
  } catch (error) {
    console.error("Error requesting boost:", error);
    throw error;
  }
};

// Admin approves a boost
export const approveBoost = async (hostelId) => {
  try {
    const res = await API.patch(`/hostels/${hostelId}/boost/approve`);
    return res.data;
  } catch (error) {
    console.error("Error approving boost:", error);
    throw error;
  }
};

// Admin rejects a boost
export const rejectBoost = async (hostelId) => {
  try {
    const res = await API.patch(`/hostels/${hostelId}/boost/reject`);
    return res.data;
  } catch (error) {
    console.error("Error rejecting boost:", error);
    throw error;
  }
};

// ===========================
// FRONTEND-ONLY COMPARE LIST
// ===========================

const COMPARE_KEY = "compare_list";

// helper: get list of hostel IDs
const getCompareIds = () => {
  return JSON.parse(localStorage.getItem(COMPARE_KEY)) || [];
};

// Add hostel to compare
export const addToCompare = async (hostelId) => {
  let list = getCompareIds();

  // limit 2 hostels
  if (list.length >= 2) {
    throw new Error("You can only compare 2 hostels at a time");
  }

  if (!list.includes(hostelId)) {
    list.push(hostelId);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  }

  return { success: true };
};

// Remove hostel from compare
export const removeFromCompare = async (hostelId) => {
  let list = getCompareIds();
  list = list.filter((id) => id !== hostelId);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  return { success: true };
};

// Clear all compare list
export const clearCompareList = async () => {
  localStorage.removeItem(COMPARE_KEY);
  return { success: true };
};

// Get compared hostels with full hostel details
export const getComparison = async () => {
  const ids = getCompareIds();

  // get ALL hostels (already provided by your function)
  const allHostels = await getHostels();

  const comparison = {
    hostel1: ids[0] ? allHostels.find((h) => (h._id || h.id) === ids[0]) : null,
    hostel2: ids[1] ? allHostels.find((h) => (h._id || h.id) === ids[1]) : null,
  };

  return { comparison };
};


