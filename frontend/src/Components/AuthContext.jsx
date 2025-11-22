import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        // Optionally verify token with backend
        API.get("/auth/profile")
          .then((res) => {
            if (res.data.success) {
              setCurrentUser(res.data.user);
              localStorage.setItem("user", JSON.stringify(res.data.user));
            }
          })
          .catch(() => {
            // Token invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setCurrentUser(null);
          })
          .finally(() => setLoading(false));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log("Attempting login with email:", email);
      const response = await API.post("/auth/login", { email, password });
      console.log("Login response:", response.data);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        return { success: true, user };
      }

      return { success: false, message: response.data.message || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      const message = error.response?.data?.message || error.message || "Login failed. Please check your connection and try again.";
      return { success: false, message };
    }
  };

  // Signup function
  const signup = async (name, email, password, role = "user") => {
    try {
      console.log("Attempting signup with email:", email);
      const response = await API.post("/auth/register", { name, email, password, role });
      console.log("Signup response:", response.data);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        return { success: true, user };
      }

      return { success: false, message: response.data.message || "Registration failed" };
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response);
      const message = error.response?.data?.message || error.message || "Registration failed. Please check your connection and try again.";
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export hook
export const useAuth = () => useContext(AuthContext);
