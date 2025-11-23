import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";


export default function HostelCard({ hostel }) {
  // Get the hostel ID - handle both _id and id fields, convert to string
  const hostelId = hostel._id || hostel.id;
  const hostelIdString = hostelId ? String(hostelId) : null;
  
  // Debug: log if ID is missing
  if (!hostelIdString) {
    console.warn("Hostel missing ID:", hostel);
    console.warn("Hostel object keys:", Object.keys(hostel));
  }

  const avgRating =
    hostel.reviews?.length > 0
      ? (
          hostel.reviews.reduce((sum, r) => sum + r.rating, 0) /
          hostel.reviews.length
        ).toFixed(1) +  ` (${hostel.reviews.length})`
      : "N/A";

  // Don't render link if no ID
  if (!hostelIdString) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 p-4">
        <p className="text-red-400">Error: Hostel ID missing</p>
        <p className="text-gray-400 text-xs mt-2">Name: {hostel.name}</p>
      </div>
    );
  }

  return (
    <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col border border-gray-700">
        <div class="relative">
            <img src={hostel.image} alt={hostel.name} class="w-full h-48 object-cover" />
        </div>
        <div class="p-4 flex flex-col flex-grow">
            <div class="flex justify-between items-start">
                 <h3 class="text-lg font-semibold text-white truncate">{hostel.name}</h3>
                 <div class="flex items-center text-sm ml-2 flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span class="ml-1 text-gray-300">{avgRating}</span>
                </div>
            </div>
            <p class="text-sm text-gray-400 mt-1 flex items-center"><MapPin className="w-4 h-4 mr-1" />{hostel.area}</p>
            <p class="text-sm text-gray-400 mt-1">For {hostel.gender} {hostel.profession}s</p>
            <p class="text-xl font-bold text-white my-2">PKR {hostel.rent.toLocaleString()}<span class="text-sm font-normal text-gray-400">/month</span></p>
            <div class="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
                <Link to={`/hostel/${hostelIdString}`} className="text-sm font-medium text-slate-300 hover:text-white">
                View Details
                </Link>
            </div>
        </div>
    </div>
  );
}
