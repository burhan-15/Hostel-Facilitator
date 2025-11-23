import API from "../api";

// Get current user's wishlist
export const getWishlist = async () => {
  try {
    const res = await API.get("/users/wishlist");
    return res.data.wishlist || [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};

// Add a hostel to wishlist
export const addToWishlist = async (hostelId) => {
  try {
    const res = await API.post("/users/wishlist", { hostelId });
    return res.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

// Remove a hostel from wishlist
export const removeFromWishlist = async (hostelId) => {
  try {
    const res = await API.delete(`/users/wishlist/${hostelId}`);
    return res.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
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