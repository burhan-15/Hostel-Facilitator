import { useAuth } from "../Components/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserReviews, getUserQuestions, getWishlist, removeFromWishlist } from "../services/userService";

import { 
  getUserVisits, 
  completeVisit, 
  cancelVisit 
} from "../services/hostelService";



export default function UserDashboard() {
  const { currentUser, logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(true);


  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const [userReviews, userQuestions, userWishlist, userVisits] = await Promise.all([
          getUserReviews(),
          getUserQuestions(),
          getWishlist(),
          getUserVisits(),  
        ]);

        const reviewsWithType = userReviews.map((r) => ({
          ...r,
          type: "review",
          date: r.createdAt || r.askedAt,
        }));

        const questionsWithType = userQuestions.map((q) => ({
          ...q,
          type: "question",
          date: q.askedAt,
        }));

        const combinedActivity = [...reviewsWithType, ...questionsWithType].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setReviews(combinedActivity.filter((a) => a.type === "review"));
        setQuestions(combinedActivity.filter((a) => a.type === "question"));

        setWishlist(userWishlist || []);

        const sorted = userVisits.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

        setVisits(sorted || []);
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
        setVisitsLoading(false);    
      }
    };

    fetchActivity();
  }, []);

  // Remove a hostel from wishlist
  const handleRemoveFromWishlist = async (hostelId) => {
    try {
      const res = await removeFromWishlist(hostelId);
      if (res.success) {
        setWishlist(wishlist.filter((h) => String(h._id || h.id) !== String(hostelId)));
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      alert("Failed to remove hostel from wishlist");
    }
  };


  const handleCancelVisit = async (visitId) => {
    try {
      const res = await cancelVisit(visitId);
      if (res.success) {
        setVisits((prev) =>
          prev.map((v) =>
            v._id === visitId ? { ...v, status: "cancelled" } : v
          )
        );
      }
    } catch (err) {
      console.error("Error cancelling visit:", err);
      alert("Failed to cancel visit");
    }
  };

  const handleCompleteVisit = async (visitId) => {
    try {
      const res = await completeVisit(visitId);
      if (res.success) {
        setVisits((prev) =>
          prev.map((v) =>
            v._id === visitId ? { ...v, status: "completed" } : v
          )
        );
      }
    } catch (err) {
      console.error("Error completing visit:", err);
      alert("Failed to mark visit as completed");
    }
  };


  // Protect route
  if (!currentUser || currentUser.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">User Dashboard</h1>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white 
                      transition-all duration-200 active:scale-95"
          >
            Logout
          </button>
        </div>

        {/* Profile */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10 
                        transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-3">Your Profile</h2>
          <p className="text-gray-300"><strong>Name:</strong> {currentUser.name}</p>
          <p className="text-gray-300"><strong>Email:</strong> {currentUser.email}</p>
          <p className="text-gray-300"><strong>Role:</strong> {currentUser.role}</p>
        </div>

        {/* Wishlist */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10">
          <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>

          {wishlist.length === 0 ? (
            <p className="text-gray-400">You haven't saved any hostels yet.</p>
          ) : (
            <div className="space-y-4">
              {wishlist.map((hostel) => {
                const hostelId = hostel._id || hostel.id;

                return (
                  <div
                    key={hostelId}
                    className="flex justify-between items-center p-4 border bg-gray-700 border-gray-700 
                              rounded-lg shadow transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                  >
                    <div>
                      <p className="text-white font-semibold">{hostel.name}</p>
                      <p className="text-gray-400 text-sm">{hostel.area}</p>
                      <p className="text-gray-400 text-sm">
                        PKR {hostel.rent.toLocaleString()}/month
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/hostel/${hostelId}`}
                        className="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-700 text-sm 
                                  transition-all duration-200 hover:scale-105"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => handleRemoveFromWishlist(hostelId)}
                        className="px-3 py-1 bg-red-700 rounded-lg hover:bg-red-600 text-sm 
                                  transition-all duration-200 hover:scale-105"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 
                        transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-5">Recent Activity</h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : reviews.length === 0 && questions.length === 0 ? (
            <p className="text-gray-400">No recent activity yet.</p>
          ) : (
            <div className="space-y-6">

              {/* Reviews */}
              {reviews.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Your Reviews</h3>
                  <ul className="space-y-3">
                    {reviews.map((rev) => (
                      <li
                        key={rev.reviewId}
                        className="border border-gray-700 rounded-lg p-3 bg-gray-850 
                                  transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                      >
                        <p><strong>Hostel:</strong> {rev.hostelName}</p>
                        <p><strong>Rating:</strong> {rev.rating} ⭐</p>
                        <p className="text-gray-300">{rev.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions */}
              {questions.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Your Questions</h3>
                  <ul className="space-y-3">
                    {questions.map((q) => (
                      <li
                        key={q._id}
                        className="border border-gray-700 rounded-lg p-3 bg-gray-850 
                                  transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                      >
                        <p><strong>Hostel:</strong> {q.hostelName}</p>
                        <p className="text-gray-300">{q.question}</p>
                        {q.answer ? (
                          <p className="text-gray-300 mt-1"><strong>Answer:</strong> {q.answer}</p>
                        ) : (
                          <p className="text-yellow-300 mt-1"><strong>Status:</strong> Not Answered Yet</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Visits */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10 mt-10">
          <h2 className="text-2xl font-semibold mb-4">My Visits</h2>

          {visitsLoading ? (
            <p className="text-gray-400">Loading visits...</p>
          ) : visits.length === 0 ? (
            <p className="text-gray-400">You haven't booked any visits yet.</p>
          ) : (
            <div className="space-y-4">
              {visits.map((v) => (
                <div
                  key={v._id}
                  className="p-4 border border-gray-700 bg-gray-700 rounded-lg 
                            transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                >
                  <p className="text-white font-semibold">Hostel: {v.hostel.name}</p>
                  <p className="text-gray-300">Date: {new Date(v.date).toLocaleString()}</p>

                  <p className="text-gray-300 mt-1">
                    Status:{" "}
                    <span
                      className={`font-bold ${
                        v.status === "approved"
                          ? "text-green-400"
                          : v.status === "pending"
                          ? "text-yellow-300"
                          : v.status === "cancelled"
                          ? "text-red-400"
                          : "text-blue-300"
                      }`}
                    >
                      {v.status.toUpperCase()}
                    </span>
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-3">
                    {v.status === "approved" && (
                      <button
                        onClick={() => handleCompleteVisit(v._id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded 
                                  transition-all hover:scale-105"
                      >
                        Mark Completed
                      </button>
                    )}

                    {(v.status === "pending" || v.status === "approved") && (
                      <button
                        onClick={() => handleCancelVisit(v._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded 
                                  transition-all hover:scale-105"
                      >
                        Cancel Visit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );

}
