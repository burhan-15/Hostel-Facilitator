import API from "../api";

// Get all FAQs of a hostel
export const getHostelFAQs = async (hostelId) => {
  try {
    const res = await API.get(`/faqs/${hostelId}/faqs`);
    return res.data.faqs || [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
};

// Add new FAQ
export const addHostelFAQ = async (hostelId, faqData) => {
  try {
    const res = await API.post(`/faqs/${hostelId}/faqs`, faqData);
    return res.data.faq;
  } catch (error) {
    console.error("Error adding FAQ:", error);
    throw error;
  }
};

// Update a FAQ
export const updateHostelFAQ = async (hostelId, faqId, updatedFaq) => {
  try {
    const res = await API.put(`/faqs/${hostelId}/faqs/${faqId}`, updatedFaq);
    return res.data.faq;
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
};

// Delete a FAQ
export const deleteHostelFAQ = async (hostelId, faqId) => {
  try {
    const res = await API.delete(`/faqs/${hostelId}/faqs/${faqId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
};
