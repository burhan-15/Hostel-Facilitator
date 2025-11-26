import express from "express";
import { 
  addToWishlist, 
  removeFromWishlist, 
  getWishlist,
  getPlainUserCount,
  getOwnerCount
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Only "user" role can manage wishlist
router.post("/wishlist", authenticate, authorize("user"), addToWishlist);
router.delete("/wishlist/:hostelId", authenticate, authorize("user"), removeFromWishlist);
router.get("/wishlist", authenticate, authorize("user"), getWishlist);

router.get("/count/plain-users", authenticate, authorize("admin"), getPlainUserCount);
router.get("/count/owners", authenticate, authorize("admin"), getOwnerCount);

export default router;
