import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getComparison,
  removeFromCompare,
  clearCompareList
} from "../services/hostelService";

export default function Compare() {
  const navigate = useNavigate();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadComparison();
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const data = await getComparison();
      setComparison(data?.comparison ?? null);
    } catch (err) {
      setError("Error loading comparison");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (hostelId) => {
    try {
      await removeFromCompare(hostelId);
      await loadComparison();
    } catch {
      alert("Error removing hostel");
    }
  };

  const handleClear = async () => {
    try {
      await clearCompareList();
      navigate("/hostels");
    } catch {
      alert("Error clearing compare list");
    }
  };

  const calcAvgRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "N/A";
    const total = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  // ------------------------------------------------ LOADING
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center p-8">
        <p className="text-gray-300 text-lg animate-pulse">Loading comparison...</p>
      </div>
    );
  }

  // ------------------------------------------------ ERROR
  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate("/hostels")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Hostels
        </button>
      </div>
    );
  }

  if (!comparison || (!comparison.hostel1 && !comparison.hostel2)) {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-8 text-center">

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-md animate-fadeIn">
        <h2 className="text-3xl font-semibold text-white mb-4">
          No Hostels Added for Comparison
        </h2>

        <p className="text-gray-300 mb-6">
          Add hostels to compare their rent, location, amenities, and more.
        </p>

        <button
          onClick={() => navigate("/hostels")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg 
                     hover:bg-indigo-700 transform hover:scale-105 
                     transition shadow-md"
        >
          Add Hostels
        </button>
      </div>

    </div>
  );
}


  const hostel1 = comparison.hostel1 || null;
  const hostel2 = comparison.hostel2 || null;

  // ------------------------------------------------ ONE HOSTEL SELECTED
  if (hostel1 && !hostel2) {
    return (
      <div className="bg-gray-900 min-h-screen p-8">
        <div
          className={`max-w-4xl mx-auto transform transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h1 className="text-4xl font-bold text-white mb-6">Compare Hostels</h1>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl hover:shadow-indigo-500/20 transition">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={hostel1.image}
                alt={hostel1.name}
                className="w-full md:w-1/2 h-60 object-cover rounded-lg transform transition hover:scale-105"
              />

              <div className="flex-1">
                <h2 className="text-2xl text-white font-semibold">{hostel1.name}</h2>
                <p className="text-gray-300 mt-2 text-lg">
                  Rs {hostel1.rent?.toLocaleString()}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleRemove(hostel1._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition transform hover:scale-105"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() => navigate(`/hostel/${hostel1._id}`)}
                    className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600 transition transform hover:scale-105"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/hostels")}
              className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg"
            >
              Add Another Hostel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------ TWO HOSTELS SELECTED
  if (hostel1 && hostel2) {
    return (
      <div className="bg-gray-900 min-h-screen p-8">
        <div
          className={`max-w-7xl mx-auto transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl text-white font-bold">Compare Hostels</h1>

            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition transform hover:scale-105"
              >
                Clear All
              </button>

              <button
                onClick={() => navigate("/hostels")}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition transform hover:scale-105"
              >
                Back
              </button>
            </div>
          </div>

          {/* COMPARISON TABLE */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
            <table className="w-full">

              <thead className="bg-gray-700 text-white">
                <tr className="animate-fadeSlideDown">
                  <th className="p-4 text-left text-lg">Field</th>

                  {[hostel1, hostel2].map((h, idx) => (
                    <th key={idx} className="p-4 text-center">
                      <span className="text-lg font-semibold">{h.name}</span>

                      <div className="mt-3 flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/hostel/${h._id}`)}
                          className="px-4 py-1.5 text-xs rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105 transition shadow-md"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleRemove(h._id)}
                          className="px-4 py-1.5 text-xs rounded-full bg-red-600 text-white hover:bg-red-700 transform hover:scale-105 transition shadow-md"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700 text-gray-300">

                <tr className="animate-row">
                  <td className="p-4">Image</td>

                  {[hostel1, hostel2].map((h, idx) => (
                    <td key={idx} className="p-4">
                      <div className="w-full aspect-video bg-gray-700 rounded overflow-hidden flex items-center justify-center">
                        {h.image ? (
                          <img
                            src={h.image}
                            alt={h.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <p className="text-gray-300 text-lg italic">No Image Available</p>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>


                {/* RENT */}
                <tr className="animate-row">
                  <td className="p-4">Monthly Rent</td>
                  <td className="p-4 text-center text-white">Rs {hostel1.rent.toLocaleString()}</td>
                  <td className="p-4 text-center text-white">Rs {hostel2.rent.toLocaleString()}</td>
                </tr>

                {/* RATING */}
                <tr className="animate-row">
                  <td className="p-4">Rating</td>
                  <td className="p-4 text-center text-white">⭐ {calcAvgRating(hostel1.reviews)}</td>
                  <td className="p-4 text-center text-white">⭐ {calcAvgRating(hostel2.reviews)}</td>
                </tr>

                {/* AREA */}
                <tr className="animate-row">
                  <td className="p-4">Area</td>
                  <td className="p-4 text-center text-white">{hostel1.area}</td>
                  <td className="p-4 text-center text-white">{hostel2.area}</td>
                </tr>

                {/* AMENITIES */}
                <tr className="animate-row">
                  <td className="p-4">Amenities</td>

                  {[hostel1, hostel2].map((h, idx) => (
                    <td key={idx} className="p-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {h.amenities?.map((a, i) => (
                          <span
                            key={i}
                            className="bg-indigo-600 px-2 py-1 rounded text-sm text-white shadow"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Wishlist Count */}
                <tr className="hover:bg-gray-700/40 transition-all hover:scale-[1.01] hover:shadow-xl">
                  <td className="p-4 text-gray-300 font-medium">Wishlisted </td>

                  <td className="p-4 text-center text-white">
                    {hostel1.shortlists || hostel1.wishlistCount || 0} 
                  </td>

                  <td className="p-4 text-center text-white">
                    {hostel2.shortlists || hostel2.wishlistCount || 0} 
                  </td>
                </tr>


              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
