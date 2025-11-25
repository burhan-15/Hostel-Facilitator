import express from "express";
import { 
  addToWishlist, 
  removeFromWishlist, 
  getWishlist,
  addToCompare,
  removeFromCompare,
  getCompareList,
  compareHostels,
  clearCompareList
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Only "user" role can manage wishlist
router.post("/wishlist", authenticate, authorize("user"), addToWishlist);
router.delete("/wishlist/:hostelId", authenticate, authorize("user"), removeFromWishlist);
router.get("/wishlist", authenticate, authorize("user"), getWishlist);

router.post("/compare", authenticate, addToCompare);
router.delete("/compare/:hostelId", authenticate, removeFromCompare);
router.get("/compare", authenticate, getCompareList);
router.get("/compare/details", authenticate, compareHostels);
router.delete("/compare", authenticate, clearCompareList);


export default router;
