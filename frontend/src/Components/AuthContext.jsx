import { createContext, useContext, useState } from "react";
import { users as initialUsers } from "../data/users";

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);   // logged-in user
  const [users, setUsers] = useState(initialUsers);       // registered users

  // Login function
  const login = (email, password) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }

    return { success: false, message: "Invalid credentials" };
  };

  // Signup function
  const signup = (name, email, password, role = "user") => {
    const exists = users.find((u) => u.email === email);

    if (exists) {
      return { success: false, message: "Email already registered" };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export hook
export const useAuth = () => useContext(AuthContext);
