import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";
import { getAllHostels, approveHostel, rejectHostel, deleteReview } from "../services/hostelService";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [users, setUsers] = useState({ users: 0, owners: 0 });
  const [loading, setLoading] = useState(true);

  // ---------------- DATA FETCHING ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hostelsData = await getAllHostels();
        setHostels(hostelsData);
        console.log(hostelsData);
        // Placeholder for user stats; replace with API call if available
        setUsers({ users: 10, owners: 5 });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ---------------- AUTH CHECK ----------------
  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ---------------- PENDING HOSTELS ----------------
 const pendingHostels = hostels.filter(h => {
  const status = h.status?.toLowerCase(); // convert to lowercase safely
  return !status || status === "pending";
});


  // ---------------- RECENT REVIEWS ----------------
  const recentReviews = hostels
    .flatMap(h =>
      (h.reviews || []).map(r => ({
        ...r,
        hostelName: h.name,
        hostelId: h._id || h.id,
        reviewId: r._id || r.id,
      }))
    )
    .slice(0, 5);

  // ---------------- APPROVE HOSTEL ----------------
  const handleApproveHostel = async (id) => {
    try {
      await approveHostel(id);
      setHostels(prev => prev.map(h => h._id === id ? { ...h, status: "approved" } : h));
    } catch (error) {
      console.error("Error approving hostel:", error);
      alert(error.response?.data?.message || "Failed to approve hostel");
    }
  };

  // ---------------- REJECT HOSTEL ----------------
  const handleRemoveHostel = async (id) => {
    if (!window.confirm("Are you sure you want to reject this hostel?")) return;

    try {
      await rejectHostel(id);
      setHostels(prev => prev.filter(h => h._id !== id));
    } catch (error) {
      console.error("Error rejecting hostel:", error);
      alert(error.response?.data?.message || "Failed to reject hostel");
    }
  };

  // ---------------- REMOVE REVIEW ----------------
  const handleRemoveReview = async (hostelId, reviewId) => {
    try {
      await deleteReview(hostelId, reviewId);
      setHostels(prev =>
        prev.map(h =>
          (h._id || h.id) === hostelId
            ? { ...h, reviews: (h.reviews || []).filter(r => (r._id || r.id) !== reviewId) }
            : h
        )
      );
    } catch (error) {
      console.error("Error removing review:", error);
      alert(error.response?.data?.message || "Failed to remove review");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ---------------- STATS CARDS ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard value={hostels.length} label="Total Hostels" />
          <StatCard value={users.users} label="Total Users" />
          <StatCard value={users.owners} label="Total Owners" />
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
              pendingHostels.map(h => {
                const hostelId = h._id || h.id;
                const ownerName =
                  typeof h.ownerId === "object"
                    ? h.ownerId.name || `Owner #${h.ownerId._id || h.ownerId.id}`
                    : `Owner #${h.ownerId}`;

                return (
                  <div
                    key={hostelId}
                    className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {h.name}
                        <span className="text-sm text-gray-400"> by {ownerName}</span>
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => handleApproveHostel(hostelId)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleRemoveHostel(hostelId)}
                        className="ml-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ---------------- RECENT REVIEWS ---------------- */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            Recent Ratings (for Management)
          </h3>

          <div className="space-y-3">
            {recentReviews.length === 0 ? (
              <p className="text-gray-400">No ratings submitted yet.</p>
            ) : (
              recentReviews.map(r => (
                <div
                  key={r.reviewId}
                  className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg"
                >
                  <div className="text-gray-300">
                    <p>
                      "{r.text}" ({r.rating} stars for {r.hostelName})
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveReview(r.hostelId, r.reviewId)}
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
