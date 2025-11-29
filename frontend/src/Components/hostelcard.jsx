import { Star, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";
import { useState, useEffect } from "react";
import { addToWishlist, removeFromWishlist, getWishlist } from "../services/userService";


export default function HostelCard({ hostel }) {
  const { currentUser } = useAuth();
  const hostelId = hostel._id || hostel.id;
  const hostelIdString = hostelId ? String(hostelId) : null;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const avgRating =
    hostel.reviews?.length > 0
      ? (
          hostel.reviews.reduce((sum, r) => sum + r.rating, 0) / hostel.reviews.length
        ).toFixed(1) + ` (${hostel.reviews.length})`
      : "N/A";

  useEffect(() => {
    const fetchLists = async () => {
      if (!currentUser?.role === "user") return;

      try {
        const wishlist = await getWishlist();
        const existsWL = wishlist.some(
          (h) => (h._id || h.id) === hostelIdString
        );
        setIsWishlisted(existsWL);
      } catch {}
    };

    fetchLists();
  }, [currentUser, hostelIdString]);

  
  const handleWishlistToggle = async () => {
    if (!currentUser) return alert("Please log in");
    if (currentUser.role !== "user") return alert("Only users can do this");

    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        await removeFromWishlist(hostelIdString);
        setIsWishlisted(false);
      } else {
        await addToWishlist(hostelIdString);
        setIsWishlisted(true);
      }
    } catch {
      alert("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };


  if (!hostelIdString) return null;

  return (
    <div className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col border border-gray-700">

      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className="absolute top-2 right-2 z-10 p-1 bg-gray-900 rounded-full hover:bg-gray-700 transition"
      >
        <Heart
          className="w-6 h-6"
          color={isWishlisted ? "red" : "gray"}
          fill={isWishlisted ? "red" : "none"}
        />
      </button>

      {/* Image */}
      <img src={hostel.image} alt={hostel.name} className="w-full h-48 object-cover" />

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white truncate">{hostel.name}</h3>
          <div className="flex items-center text-sm ml-2 flex-shrink-0">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-gray-300">{avgRating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-1 flex items-center">
          <MapPin className="w-4 h-4 mr-1" /> {hostel.area}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          For {hostel.gender} {hostel.profession}s
        </p>

        <p className="text-xl font-bold text-white my-2">
          PKR {hostel.rent.toLocaleString()}
          <span className="text-sm font-normal text-gray-400">/month</span>
        </p>

        <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
          <Link
            to={`/hostel/${hostelIdString}`}
            className="text-sm font-medium text-slate-300 hover:text-white"
          >
            View Details
          </Link>

        </div>
      </div>
    </div>
  );
}
