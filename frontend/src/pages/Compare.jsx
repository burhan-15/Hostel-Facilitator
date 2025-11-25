import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getComparison,
  removeFromCompare,
  clearCompareList,
} from "../services/userService";

export default function Compare() {
  const navigate = useNavigate();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // mounted controls fade/slide animation
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadComparison();
    // small delay to trigger entrance animation
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getComparison(); // expects { comparison: { hostel1, hostel2 } }
      // compat: some backends return { comparison } or { comparison: null }
      setComparison(data?.comparison ?? null);
    } catch (err) {
      setError(err?.response?.data?.message || "Error loading comparison");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (hostelId) => {
    try {
      await removeFromCompare(hostelId);
      await loadComparison();
      // brief visual feedback: re-run entrance animation
      setMounted(false);
      setTimeout(() => setMounted(true), 40);
    } catch (err) {
      alert(err?.response?.data?.message || "Error removing hostel");
    }
  };

  const handleClear = async () => {
    try {
      await clearCompareList();
      navigate("/hostels");
    } catch (err) {
      alert(err?.response?.data?.message || "Error clearing compare list");
    }
  };

  const calcAvgRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "N/A";
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-4">
          <div className="h-8 w-1/3 bg-gray-700 rounded animate-pulse" />
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="h-56 bg-gray-700 rounded animate-pulse" />
            <div className="mt-4 flex gap-3">
              <div className="h-6 w-1/4 bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-1/4 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate("/hostels")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5"
        >
          Back to Hostels
        </button>
      </div>
    );
  }

  // --- Nothing selected yet ---
  if (!comparison) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl text-gray-300 mb-4">Please select hostels to compare</h2>
        <button
          onClick={() => navigate("/hostels")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5"
        >
          Go to Hostels
        </button>
      </div>
    );
  }

  const hostel1 = comparison.hostel1 ?? null;
  const hostel2 = comparison.hostel2 ?? null;

  // If only one hostel in compare list, show one-hostel UI + CTA to add another
  if (hostel1 && !hostel2) {
    return (
      <div className="bg-gray-900 min-h-screen p-8">
        <div className={`max-w-4xl mx-auto transform transition duration-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h1 className="text-4xl font-bold text-white mb-6">Compare Hostels</h1>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-md hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img src={hostel1.image} alt={hostel1.name} className="w-full md:w-1/2 h-60 object-cover rounded-lg transform transition hover:scale-105" />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white">{hostel1.name}</h2>
                <p className="text-gray-300 mt-2">PKR {hostel1.rent?.toLocaleString()} / month</p>
                <p className="text-gray-400 mt-1">{hostel1.area}</p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleRemove(hostel1._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition transform hover:-translate-y-0.5"
                  >
                    Remove from Compare
                  </button>

                  <button
                    onClick={() => navigate(`/hostel/${hostel1._id}`)}
                    className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600 transition transform hover:-translate-y-0.5"
                  >
                    View Hostel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/hostels")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5"
            >
              Add Another Hostel to Compare
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If both hostels present, show table compare UI
  if (hostel1 && hostel2) {
    return (
      <div className="bg-gray-900 min-h-screen p-8">
        <div className={`max-w-7xl mx-auto transform transition duration-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Compare Hostels</h1>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition transform hover:-translate-y-0.5"
              >
                Clear All
              </button>
              <button
                onClick={() => navigate("/hostels")}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition transform hover:-translate-y-0.5"
              >
                Back to Hostels
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="w-1/3 p-4 text-left text-white font-semibold">Hostels</th>
                  <th className="w-1/3 p-4 text-center text-white font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-semibold">{hostel1.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemove(hostel1._id)}
                          className="text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => navigate(`/hostel/${hostel1._id}`)}
                          className="text-xs bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 transition"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </th>
                  <th className="w-1/3 p-4 text-center text-white font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-semibold">{hostel2.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemove(hostel2._id)}
                          className="text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => navigate(`/hostel/${hostel2._id}`)}
                          className="text-xs bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 transition"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {/* Image */}
                <tr className="hover:translate-x-0 hover:shadow-sm transition transform duration-200">
                  <td className="p-4 text-gray-300 font-medium">Image</td>
                  <td className="p-4">
                    <img src={hostel1.image} alt={hostel1.name} className="w-full h-48 object-cover rounded transform transition hover:scale-105" />
                  </td>
                  <td className="p-4">
                    <img src={hostel2.image} alt={hostel2.name} className="w-full h-48 object-cover rounded transform transition hover:scale-105" />
                  </td>
                </tr>

                {/* Rent */}
                <tr className="bg-gray-900/20">
                  <td className="p-4 text-gray-300 font-medium">Monthly Rent</td>
                  <td className="p-4 text-center">
                    <span className="text-lg font-bold text-white">Rs {hostel1.rent?.toLocaleString()}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-lg font-bold text-white">Rs {hostel2.rent?.toLocaleString()}</span>
                  </td>
                </tr>

                {/* Rating */}
                <tr>
                  <td className="p-4 text-gray-300 font-medium">Average Rating</td>
                  <td className="p-4 text-center">
                    <div className="text-white font-semibold">⭐ {calcAvgRating(hostel1.reviews)}</div>
                    <div className="text-gray-400 text-sm">({hostel1.reviews?.length || 0} reviews)</div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-white font-semibold">⭐ {calcAvgRating(hostel2.reviews)}</div>
                    <div className="text-gray-400 text-sm">({hostel2.reviews?.length || 0} reviews)</div>
                  </td>
                </tr>

                {/* Area */}
                <tr className="bg-gray-900/20">
                  <td className="p-4 text-gray-300 font-medium">Area</td>
                  <td className="p-4 text-center text-white">{hostel1.area}</td>
                  <td className="p-4 text-center text-white">{hostel2.area}</td>
                </tr>

                {/* Amenities */}
                <tr className="bg-gray-900/20">
                  <td className="p-4 text-gray-300 font-medium">Amenities</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(hostel1.amenities || []).map((a, idx) => (
                        <span key={idx} className="bg-indigo-600 text-white px-2 py-1 rounded text-sm">{a}</span>
                      ))}
                      {(hostel1.amenities || []).length === 0 && <span className="text-gray-400">No amenities</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(hostel2.amenities || []).map((a, idx) => (
                        <span key={idx} className="bg-indigo-600 text-white px-2 py-1 rounded text-sm">{a}</span>
                      ))}
                      {(hostel2.amenities || []).length === 0 && <span className="text-gray-400">No amenities</span>}
                    </div>
                  </td>
                </tr>

                {/* Shortlists */}
                <tr>
                  <td className="p-4 text-gray-300 font-medium">Shortlisted By</td>
                  <td className="p-4 text-center text-white">{hostel1.shortlists || 0}</td>
                  <td className="p-4 text-center text-white">{hostel2.shortlists || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    );
  }

  // fallback
  return null;
}
