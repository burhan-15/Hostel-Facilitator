import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide name, email, and password" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user (default role is 'user' unless specified)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data (without password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    console.error("Error details:", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error during registration" 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("=== LOGIN REQUEST ===");
    console.log("Email:", email);
    console.log("Password provided:", password ? "Yes (length: " + password.length + ")" : "No");

    // Validate input
    if (!email || !password) {
      console.log("Validation failed: Missing email or password");
      return res.status(400).json({ 
        success: false, 
        message: "Please provide email and password" 
      });
    }

    // Find user
    console.log("Searching for user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      // List all users for debugging
      const allUsers = await User.find({}).select("email role name");
      console.log("Available users in database:", allUsers.map(u => ({ email: u.email, role: u.role, name: u.name })));
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    console.log("User found:", { id: user._id, email: user.email, role: user.role, name: user.name });
    console.log("Stored password hash exists:", user.password ? "Yes" : "No");

    // Check password
    console.log("Comparing password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);
    
    if (!isPasswordValid) {
      console.log("Password comparison failed");
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    console.log("Password is valid, generating token...");

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data (without password)
    console.log("Login successful! Returning token and user data");
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    console.log("=== LOGIN SUCCESS ===");
  } catch (error) {
    console.error("=== LOGIN ERROR ===");
    console.error("Login error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error during login" 
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Debug endpoint - Get all users (for debugging only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    console.log("All users in database:", users.map(u => ({ email: u.email, role: u.role, name: u.name })));
    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

