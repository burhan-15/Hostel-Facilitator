import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";

// Mock data imports
import { hostels as hostelData } from "../data/hostelMock";
import { users } from "../data/users";

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  // Only admins allowed

  // Runtime mutable data
  const [hostels, setHostels] = useState(hostelData);
//   const [users, setUsers] = useState(usersData);

    if (!currentUser || currentUser.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

  // Pending approvals
  const pendingHostels = hostels.filter((h) => h.status === "pending");

  // Recent 5 reviews
  const recentReviews = hostels
    .flatMap((h) =>
      h.reviews.map((r) => ({
        ...r,
        hostelName: h.name,
        hostelId: h.id,
      }))
    )
    .slice(0, 5);

  // Approve hostel
  const approveHostel = (id) => {
    setHostels((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, status: "approved" } : h
      )
    );
  };

  // Reject / delete hostel
  const removeHostel = (id) => {
    setHostels((prev) => prev.filter((h) => h.id !== id));
  };

  // Remove a review
  const removeReview = (hostelId, reviewId) => {
    setHostels((prev) =>
      prev.map((h) =>
        h.id === hostelId
          ? { ...h, reviews: h.reviews.filter((r) => r.id !== reviewId) }
          : h
      )
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ---------------- STATS CARDS ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            value={hostels.length}
            label="Total Hostels"
          />

          <StatCard
            value={users.filter((u) => u.role === "user").length}
            label="Total Users"
          />

          <StatCard
            value={users.filter((u) => u.role === "owner").length}
            label="Total Owners"
          />
        </div>

        {/* ---------------- PENDING HOSTELS ---------------- */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            Pending Hostel Listings ({pendingHostels.length})
          </h3>

          <div className="space-y-3">
            {pendingHostels.length === 0 ? (
              <p className="text-gray-400">No pending approvals.</p>
            ) : (
              pendingHostels.map((h) => (
                <div
                  key={h.id}
                  className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {h.name}
                      <span className="text-sm text-gray-400">
                        {" "}
                        by Owner #{h.ownerId}
                      </span>
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => approveHostel(h.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => removeHostel(h.id)}
                      className="ml-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ---------------- RECENT RATINGS ---------------- */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            Recent Ratings (for Management)
          </h3>

          <div className="space-y-3">
            {recentReviews.length === 0 ? (
              <p className="text-gray-400">No ratings submitted yet.</p>
            ) : (
              recentReviews.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg"
                >
                  <div className="text-gray-300">
                    <p>
                      "{r.text}" ({r.rating} stars for {r.hostelName})
                    </p>
                  </div>

                  <button
                    onClick={() => removeReview(r.hostelId, r.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STAT CARD COMPONENT ---------------- */

function StatCard({ value, label }) {
  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg text-center">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}
