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

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const data = await getComparison();
      setComparison(data.comparison || null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error loading comparison");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (hostelId) => {
    try {
      await removeFromCompare(hostelId);
      loadComparison();
    } catch (err) {
      alert(err.response?.data?.message || "Error removing hostel");
    }
  };

  const handleClear = async () => {
    try {
      await clearCompareList();
      navigate("/hostels");
    } catch (err) {
      alert(err.response?.data?.message || "Error clearing compare list");
    }
  };

  const calcAvgRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "N/A";
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading comparison...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate("/hostels")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Back to Hostels
        </button>
      </div>
    );
  }

  if (!comparison) {
    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-gray-300 text-xl mb-4">Please select hostels to compare</p>
        <button
            onClick={() => navigate("/hostels")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
            Go to Hostels
        </button>
        </div>
    );
    }

    const hostel1 = comparison.hostel1 || null;
    const hostel2 = comparison.hostel2 || null;

    // CASE: Only one hostel in compare list
    if (hostel1 && !hostel2) {
    return (
        <div className="bg-gray-900 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-6">Compare Hostels</h1>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white">{hostel1.name}</h2>

            <img
                src={hostel1.image}
                alt={hostel1.name}
                className="w-full h-60 object-cover rounded mt-4"
            />

            <p className="text-gray-300 mt-4 text-lg">
                PKR {hostel1.rent.toLocaleString()} / month
            </p>
            <p className="text-gray-400 mt-1">{hostel1.area}</p>

            {/* Remove Button */}
            <button
                onClick={() => handleRemove(hostel1._id)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Remove from Compare
            </button>
            </div>

            {/* Add Second Hostel Button */}
            <div className="text-center mt-8">
            <button
                onClick={() => navigate("/hostels")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
                Add Another Hostel to Compare
            </button>
            </div>
        </div>
        </div>
    );
    }

    // CASE: No hostel2 and no hostel1
    if (!hostel1 && !hostel2) {
    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-gray-300 text-xl mb-4">
            Nothing to compare yet.
        </p>
        <button
            onClick={() => navigate("/hostels")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
            Go to Hostels
        </button>
        </div>
    );
    }
  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Compare Hostels</h1>

          <div className="flex gap-4">
            <button
              onClick={handleClear}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Clear All
            </button>
            <button
              onClick={() => navigate("/hostels")}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Back to Hostels
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="w-1/3 p-4 text-left text-white font-semibold">
                  Hostels
                </th>

                <th className="w-1/3 p-4 text-center text-white font-semibold">
                  <div className="flex flex-col items-center gap-2">
                    <span>{hostel1.name}</span>
                    <button
                      onClick={() => handleRemove(hostel1._id)}

                      className="text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </th>

                <th className="w-1/3 p-4 text-center text-white font-semibold">
                  <div className="flex flex-col items-center gap-2">
                    <span>{hostel2.name}</span>
                    <button
                      onClick={() => handleRemove(hostel2._id)}

                      className="text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">

              {/* Image */}
              <tr>
                <td className="p-4 text-gray-300 font-medium">Image</td>
                <td className="p-4">
                  <img
                    src={hostel1.image}
                    alt={hostel1.name}
                    className="w-full h-48 object-cover rounded"
                  />
                </td>
                <td className="p-4">
                  <img
                    src={hostel2.image}
                    alt={hostel2.name}
                    className="w-full h-48 object-cover rounded"
                  />
                </td>
              </tr>

              {/* RENT */}
              <tr className="bg-gray-800">
                <td className="p-4 text-gray-300 font-medium">Monthly Rent</td>
                <td className="p-4 text-center">
                  <span className="text-lg font-bold text-white">
                    Rs {hostel1.rent.toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-lg font-bold text-white">
                    Rs {hostel2.rent.toLocaleString()}
                  </span>
                </td>
              </tr>

              {/* RATING */}
              <tr>
                <td className="p-4 text-gray-300 font-medium">Average Rating</td>

                <td className="p-4 text-center">
                  ⭐ {calcAvgRating(hostel1.reviews)}
                  <p className="text-gray-400 text-sm">
                    ({hostel1.reviews?.length} reviews)
                  </p>
                </td>

                <td className="p-4 text-center">
                  ⭐ {calcAvgRating(hostel2.reviews)}
                  <p className="text-gray-400 text-sm">
                    ({hostel2.reviews?.length} reviews)
                  </p>
                </td>
              </tr>

              {/* AREA */}
              <tr>
                <td className="p-4 text-gray-300 font-medium">Area</td>
                <td className="p-4 text-center text-white">{hostel1.area}</td>
                <td className="p-4 text-center text-white">{hostel2.area}</td>
              </tr>

              {/* GENDER */}
              <tr>
                <td className="p-4 text-gray-300 font-medium">Gender</td>
                <td className="p-4 text-center text-white">{hostel1.gender}</td>
                <td className="p-4 text-center text-white">{hostel2.gender}</td>
              </tr>

              {/* AMENITIES */}
              <tr>
                <td className="p-4 text-gray-300 font-medium">Amenities</td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(hostel1.amenities || []).map((a, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-600 text-white px-2 py-1 rounded text-sm"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(hostel2.amenities || []).map((a, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-600 text-white px-2 py-1 rounded text-sm"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>

              {/* SHORTLIST */}
              <tr>
                <td className="p-4 text-gray-300 font-medium">Shortlisted By</td>
                <td className="p-4 text-center text-white">{hostel1.shortlists || 0}</td>
                <td className="p-4 text-center text-white">{hostel2.shortlists || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate(`/hostel/${hostel1._id}`)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            View {hostel1.name}
          </button>

          <button
            onClick={() => navigate(`/hostel/${hostel2._id}`)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            View {hostel2.name}
          </button>
        </div>
      </div>
    </div>
  );
}
