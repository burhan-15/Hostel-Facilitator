import express from "express";
import { register, login, getProfile, getAllUsers } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.get("/debug/users", getAllUsers); // Debug endpoint - remove in production

export default router;
