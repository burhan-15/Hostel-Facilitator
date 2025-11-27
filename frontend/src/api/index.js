import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});


// 1. Automatically attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// 2. Handle expired/invalid tokens properly

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem("token");

    
    // If user HAS token but it is invalid/expired
    // → clear it and redirect to login
    if (status === 401 && token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    

    return Promise.reject(error);
  }
);

export default API;
