// src/services/faqService.js
import API from "../api"; // your configured axios instance

export const getFAQs = async () => {
  try {
    const res = await API.get("/faqs"); // base url points to /api already in your API wrapper
    return res.data; // the controller returns an array directly
  } catch (err) {
    console.error("getFAQs error:", err);
    throw err;
  }
};

export const createFAQ = async (payload) => {
  try {
    const res = await API.post("/faqs", payload);
    return res.data; // created FAQ object
  } catch (err) {
    console.error("createFAQ error:", err);
    throw err;
  }
};

export const updateFAQ = async (id, payload) => {
  try {
    const res = await API.put(`/faqs/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("updateFAQ error:", err);
    throw err;
  }
};

export const deleteFAQ = async (id) => {
  try {
    const res = await API.delete(`/faqs/${id}`);
    return res.data;
  } catch (err) {
    console.error("deleteFAQ error:", err);
    throw err;
  }
};
