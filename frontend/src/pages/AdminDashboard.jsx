import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";

// HOSTEL ACTIONS
import {
  getAllHostels,
  approveHostel,
  rejectHostel,
  approveBoost,
  rejectBoost,
  deleteReview,
} from "../services/hostelService";

// FAQ SERVICE
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "../services/faqService";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [users, setUsers] = useState({ users: 0, owners: 0 });
  const [loading, setLoading] = useState(true);

  // FAQ STATES
  const [faqs, setFaqs] = useState([]);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const hostelsData = await getAllHostels();
        setHostels(hostelsData);

        // placeholder numbers
        setUsers({ users: 10, owners: 5 });

        const faqData = await getFAQs();
        setFaqs(Array.isArray(faqData) ? faqData : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ---------------- AUTH CHECK ----------------
  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/" replace />;

  // ---------------- FILTER PENDING HOSTELS ----------------
  const pendingHostels = hostels.filter((h) => {
    const status = h.status?.toLowerCase();
    return !status || status === "pending";
  });

  // ---------------- RECENT REVIEWS ----------------
  const recentReviews = hostels
    .flatMap((h) =>
      (h.reviews || []).map((r) => ({
        ...r,
        hostelName: h.name,
        hostelId: h._id,
        reviewId: r._id,
      }))
    )
    .slice(0, 5);

  // ---------------- HOSTEL ACTIONS ----------------
  const handleApproveHostel = async (id) => {
    try {
      await approveHostel(id);
      setHostels((prev) =>
        prev.map((h) => (h._id === id ? { ...h, status: "approved" } : h))
      );
    } catch (e) {
      console.error(e);
      alert("Failed to approve hostel");
    }
  };

  const handleRejectHostel = async (id) => {
    if (!window.confirm("Reject this hostel?")) return;
    try {
      await rejectHostel(id);
      setHostels((prev) => prev.filter((h) => h._id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to reject hostel");
    }
  };

  // ---------------- BOOST ACTIONS ----------------
  const handleApproveBoost = async (id) => {
    try {
      // backend returns updated hostel or updated boost object
      const updatedBoost = await approveBoost(id);

      setHostels((prev) =>
        prev.map((h) =>
          h._id === id
            ? {
                ...h,
                boost: {
                  ...h.boost,
                  ...updatedBoost.boost, // <-- FIX: replace with the latest backend boost object
                },
              }
            : h
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to approve boost");
    }
  };


  const handleRejectBoost = async (id) => {
    if (!window.confirm("Remove this boost request?")) return;
    try {
      await rejectBoost(id);
      setHostels((prev) =>
        prev.map((h) =>
          h._id === id
            ? {
                ...h,
                boost: {
                  ...h.boost,
                  status: "rejected",
                  isActive: false,
                },
              }
            : h
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to remove boost");
    }
  };

  // ---------------- REVIEW DELETE ----------------
  const handleRemoveReview = async (hostelId, reviewId) => {
    try {
      await deleteReview(hostelId, reviewId);
      setHostels((prev) =>
        prev.map((h) =>
          h._id === hostelId
            ? { ...h, reviews: (h.reviews || []).filter((r) => r._id !== reviewId) }
            : h
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to remove review");
    }
  };

  // ---------------- FAQ LOGIC ----------------
  const resetFAQForm = () => {
    setFaqQuestion("");
    setFaqAnswer("");
    setEditingId(null);
  };

  const handleSubmitFAQ = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateFAQ(editingId, {
          question: faqQuestion,
          answer: faqAnswer,
        });

        setFaqs((prev) => prev.map((f) => (f._id === editingId ? updated : f)));
      } else {
        const newFAQ = await createFAQ({
          question: faqQuestion,
          answer: faqAnswer,
        });

        setFaqs((prev) => [newFAQ, ...prev]);
      }

      resetFAQForm();
    } catch (error) {
      console.error(error);
      alert("Failed to save FAQ");
    }
  };

  const startEditingFAQ = (faq) => {
    setEditingId(faq._id);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
  };

  const deleteFAQConfirm = async () => {
    try {
      await deleteFAQ(confirmDeleteId);
      setFaqs((prev) => prev.filter((f) => f._id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ------------ STATS ------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard value={hostels.length} label="Total Hostels" />
          <StatCard value={users.users} label="Total Users" />
          <StatCard value={users.owners} label="Total Owners" />
        </div>

        {/* ------------ PENDING HOSTELS ------------- */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-bold mb-4">
            Pending Hostel Listings ({pendingHostels.length})
          </h3>

          <div className="space-y-3">
            {pendingHostels.length === 0 ? (
              <p className="text-gray-400">No pending approvals.</p>
            ) : (
              pendingHostels.map((h) => (
                <div
                  key={h._id}
                  className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
                >
                  <p className="font-semibold">{h.name}</p>

                  <div>
                    <button
                      onClick={() => handleApproveHostel(h._id)}
                      className="px-3 py-1 bg-green-600 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleRejectHostel(h._id)}
                      className="ml-2 px-3 py-1 bg-red-600 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ------------ BOOST REQUESTS (UPDATED) ------------- */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-bold mb-4">
            Boost Requests ({hostels.filter((h) => h.boost.isActive).length})
          </h3>

          <div className="space-y-3">
            {hostels.filter((h) => h.boost.isActive).length === 0 ? (
              <p className="text-gray-400">No boost activity.</p>
            ) : (
              hostels
                .filter((h) => h.boost.isActive)
                .map((h) => (
                  <div
                    key={h._id}
                    className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{h.name}</p>

                      <p className="text-gray-400 text-sm">
                        Duration: {h.boost?.durationDays} days
                      </p>

                      <p className="text-gray-400 text-sm capitalize">
                        Status:{" "}
                        <span
                          className={
                            h.boost.status === "approved"
                              ? "text-green-400"
                              : h.boost.status === "pending"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }
                        >
                          {h.boost.status}
                        </span>
                      </p>

                      {h.boost.status === "approved" && (
                        <p className="text-gray-400 text-sm">
                          {new Date(h.boost.startDate).toLocaleDateString()} →{" "}
                          {new Date(h.boost.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2">
                      {h.boost.status === "pending" && (
                        <button
                          onClick={() => handleApproveBoost(h._id)}
                          className="px-3 py-1 bg-green-600 rounded"
                        >
                          Approve
                        </button>
                      )}

                      <button
                        onClick={() => handleRejectBoost(h._id)}
                        className="px-3 py-1 bg-red-600 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* ------------ RECENT REVIEWS ------------- */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-bold mb-4">Recent Ratings</h3>

          <div className="space-y-3">
            {recentReviews.length === 0 ? (
              <p className="text-gray-400">No ratings yet.</p>
            ) : (
              recentReviews.map((r) => (
                <div
                  key={r.reviewId}
                  className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
                >
                  <p className="text-gray-300">
                    "{r.text}" ({r.rating} stars for {r.hostelName})
                  </p>

                  <button
                    onClick={() => handleRemoveReview(r.hostelId, r.reviewId)}
                    className="px-3 py-1 bg-red-600 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ------------ FAQ MANAGEMENT ------------- */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-bold mb-4">Manage FAQs</h3>

          {/* Add/Edit Form */}
          <form onSubmit={handleSubmitFAQ} className="mb-6">
            <input
              type="text"
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
              placeholder="FAQ Question"
              className="w-full p-2 mb-3 rounded bg-gray-700"
              required
            />

            <textarea
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
              placeholder="FAQ Answer"
              className="w-full p-2 mb-3 rounded bg-gray-700"
              rows="3"
              required
            />

            <div className="flex gap-3">
              <button className="bg-indigo-600 px-4 py-2 rounded">
                {editingId ? "Update FAQ" : "Add FAQ"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="bg-gray-600 px-4 py-2 rounded"
                  onClick={resetFAQForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* FAQ List */}
          <div className="space-y-3">
            {faqs.length === 0 ? (
              <p className="text-gray-400">No FAQs found.</p>
            ) : (
              faqs.map((f) => (
                <div
                  key={f._id}
                  className="bg-gray-700 p-3 rounded flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{f.question}</p>
                    <p className="text-gray-300">{f.answer}</p>
                  </div>

                  <div className="flex gap-6">
                    <button
                      type="button"
                      className="w-[5rem] bg-blue-600 rounded"
                      onClick={() => startEditingFAQ(f)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="w-[5rem] bg-red-600 rounded"
                      onClick={() => setConfirmDeleteId(f._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DELETE CONFIRMATION */}
          {confirmDeleteId && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-gray-900 p-6 rounded shadow-xl text-center">
                <p className="text-xl mb-4">Delete this FAQ?</p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={deleteFAQConfirm}
                    className="px-4 py-2 bg-red-600 rounded"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-4 py-2 bg-gray-600 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}
