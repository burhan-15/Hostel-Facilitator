import express from "express";
import { 
  addToWishlist, 
  removeFromWishlist, 
  getWishlist,
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Only "user" role can manage wishlist
router.post("/wishlist", authenticate, authorize("user"), addToWishlist);
router.delete("/wishlist/:hostelId", authenticate, authorize("user"), removeFromWishlist);
router.get("/wishlist", authenticate, authorize("user"), getWishlist);


export default router;
