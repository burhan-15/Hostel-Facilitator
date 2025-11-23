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

export const getUserReviews = async () => {
  try {
    const res = await API.get(`/reviews/user/my-reviews`);
    return res.data.reviews || [];
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }
};

// Get all questions asked by the logged-in user
export const getUserQuestions = async () => {
  try {
    const res = await API.get(`/hostels/user/my-questions`);
    return res.data.questions || [];
  } catch (error) {
    console.error("Error fetching user questions:", error);
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

