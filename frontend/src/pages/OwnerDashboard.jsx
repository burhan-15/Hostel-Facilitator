import { useState, useEffect } from "react";
import { useAuth } from "../Components/AuthContext";
import { Navigate } from "react-router-dom";
import { Eye, Heart } from "lucide-react";

import AddHostelModal from "../Components/addHostelModal";
import EditHostelModal from "../Components/EditHostelModal";
import ManageFaqModal from "../Components/ManageFaqModal";
import BoostModal from "../Components/boostModal";

import { getMyHostels, deleteHostel, answerQuestion } from "../services/hostelService";

export default function OwnerDashboard() {
  const { currentUser } = useAuth();

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHostel, setEditHostel] = useState(null);
  const [showFaqModal, setShowFaqModal] = useState(false); 
  const [faqHostelId, setFaqHostelId] = useState(null);

  // Boost Modal states
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostHostelId, setBoostHostelId] = useState(null);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const data = await getMyHostels();
        setHostels(data);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  if (!currentUser || currentUser.role !== "owner") {
    return <Navigate to="/login" replace />;
  }

  const unansweredQuestions = hostels.flatMap((h) =>
    (h.questions || [])
      .filter((q) => !q.answer)
      .map((q) => ({
        ...q,
        hostelName: h.name,
        hostelId: h._id || h.id,
        questionId: q._id || q.id,
      }))
  );

  const handleDeleteHostel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) return;
    try {
      await deleteHostel(id);
      setHostels((prev) => prev.filter((h) => (h._id || h.id) !== id));
    } catch (error) {
      console.error("Error deleting hostel:", error);
      alert(error.response?.data?.message || "Failed to delete hostel");
    }
  };

  const submitAnswer = async (hostelId, questionId, text) => {
    if (!text.trim()) return;
    try {
      const result = await answerQuestion(hostelId, questionId, text);
      if (result.success) {
        const data = await getMyHostels();
        setHostels(data);
      }
    } catch (error) {
      console.error("Error answering question:", error);
      alert(error.response?.data?.message || "Failed to answer question");
    }
  };

  const handleAddHostel = async () => {
    const data = await getMyHostels();
    setHostels(data);
  };

  const handleUpdateHostel = async () => {
    const data = await getMyHostels();
    setHostels(data);
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* --- My Hostel Listings --- */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-2xl font-bold mb-4">My Hostel Listings</h3>

          <div className="space-y-4">
            {hostels.length === 0 && (
              <p className="text-gray-400">You do not own any hostels.</p>
            )}

            {hostels.map((h) => {
              const hostelId = h._id || h.id;
              return (
                <div
                  key={hostelId}
                  className="flex flex-wrap justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg gap-2"
                >
                  <div>
                    <p className="font-semibold">
                      {h.name}{' '}
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          h.status === "approved"
                            ? "text-green-300 bg-green-800"
                            : "text-yellow-300 bg-yellow-800"
                        }`}
                      >
                        {h.status.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-400 my-1">{h.area}</p>
                    <p className="text-sm text-gray-400 flex items-center ">
                      <Eye className="w-4 h-4 text-white inline mr-2" /> {h.views} 
                      <Heart className="w-4 h-4 text-white inline mx-2" fill="white" /> {h.shortlists}
                    </p>

                    {/* Boost Status */}
                    {h.boost.isActive && (
                      <p className="text-xs mt-1 text-white">
                        Boost Status: <span className ="text-yellow-400">{h.boost.status?.toUpperCase() || "PENDING"}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center space-x-2 gap-2">
                    <button
                      onClick={() => {
                        setEditHostel(h);
                        setShowEditModal(true);
                      }}
                      className="text-sm px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => handleDeleteHostel(hostelId)}
                      className="text-sm px-3 py-1 bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>

                    {/* Boost Button */}
                    {h.status === "approved" && !h.boost.isActive && (
                      <button
                        onClick={() => {
                          setBoostHostelId(hostelId);
                          setShowBoostModal(true);
                        }}
                        className="text-sm px-3 py-1 bg-yellow-600 rounded-md hover:bg-yellow-700"
                      >
                        Boost Hostel
                      </button>
                    )}

                    {h.status === "approved" && (
                      <button
                        onClick={() => {
                          setFaqHostelId(hostelId);
                          setShowFaqModal(true);
                        }}
                        className="text-sm px-3 py-1 bg-purple-600 rounded-md hover:bg-purple-700"
                      >
                        Manage FAQs
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 bg-slate-600 rounded-lg hover:bg-slate-700"
          >
            Add New Hostel
          </button>
        </div>

        {/* --- Modals --- */}
        {showAddModal && (
          <AddHostelModal
            closeModal={() => setShowAddModal(false)}
            addHostel={handleAddHostel}
            currentUser={currentUser}
          />
        )}

        {showEditModal && editHostel && (
          <EditHostelModal
            hostel={editHostel}
            closeModal={() => {
              setShowEditModal(false);
              setEditHostel(null);
            }}
            updateHostel={handleUpdateHostel}
          />
        )}

        {showFaqModal && faqHostelId && (
          <ManageFaqModal
            isOpen={showFaqModal}
            onClose={() => setShowFaqModal(false)}
            hostelId={faqHostelId}
            currentUser={currentUser}
          />
        )}

        {showBoostModal && boostHostelId && (
          <BoostModal
            hostelId={boostHostelId}
            onClose={() => setShowBoostModal(false)}
            refreshHostels={handleUpdateHostel}
          />
        )}

        {/* --- Pending Questions Section --- */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-2xl font-bold mb-4">Pending Questions</h3>

          {unansweredQuestions.length === 0 ? (
            <p className="text-gray-400">No unanswered questions at the moment.</p>
          ) : (
            <div className="space-y-4">
              {unansweredQuestions.map((q) => (
                <PendingQuestionCard
                  key={q.questionId}
                  q={q}
                  submitAnswer={submitAnswer}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Pending Question Card Component
function PendingQuestionCard({ q, submitAnswer }) {
  const [text, setText] = useState("");

  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-gray-700">
      <p className="font-semibold text-white">Q: {q.text}</p>
      <p className="text-sm text-gray-400 mb-2">
        On: <span className="font-medium">{q.hostelName}</span>
      </p>

      <div className="flex items-center">
        <textarea
          rows="1"
          className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md mr-2"
          placeholder="Your answer..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="px-4 py-2 bg-slate-600 rounded-lg hover:bg-slate-700 flex-shrink-0"
          onClick={async () => {
            if (text.trim() !== "") {
              await submitAnswer(q.hostelId, q.questionId, text.trim());
              setText("");
            }
          }}
        >
          Reply
        </button>
      </div>
    </div>
  );
}
