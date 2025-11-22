import { useState } from "react";
import { useAuth } from "../Components/AuthContext";
import { Navigate } from "react-router-dom";

import { hostels as hostelData } from "../data/hostelMock";
import AddHostelModal from "../Components/addHostelModal";
import EditHostelModal from "../Components/EditHostelModal";
// import { users } from "../data/users";

export default function OwnerDashboard() {
  const { currentUser } = useAuth();


  // Make runtime editable copy
  const [hostels, setHostels] = useState(hostelData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHostel, setEditHostel] = useState(null);


  // Only owners allowed
  if (!currentUser || currentUser.role !== "owner") {
    return <Navigate to="/login" replace />;
  }

  // Filter hostels owned by this owner
  const ownerHostels = hostels.filter(
    (h) => h.ownerId === currentUser.id
  );

  // Extract unanswered questions
  const unansweredQuestions = ownerHostels.flatMap((h) =>
    h.questions
      .filter((q) => !q.answer)
      .map((q) => ({
        ...q,
        hostelName: h.name,
        hostelId: h.id,
      }))
  );

  // Delete hostel (runtime only)
  const deleteHostel = (id) => {
    setHostels((prev) => prev.filter((h) => h.id !== id));
  };

  // Submit answer to a question
  const submitAnswer = (hostelId, qid, text) => {
    if (!text.trim()) return;

    setHostels((prev) =>
      prev.map((h) => {
        if (h.id !== hostelId) return h;

        return {
          ...h,
          questions: h.questions.map((q) =>
            q.id === qid ? { ...q, answer: text } : q
          ),
        };
      })
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* --- My Hostel Listings --- */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-2xl font-bold mb-4">My Hostel Listings</h3>

          <div className="space-y-4">
            {ownerHostels.length === 0 && (
              <p className="text-gray-400">You do not own any hostels.</p>
            )}

            {ownerHostels.map((h) => (
              <div
                key={h.id}
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
                  <p className="text-sm text-gray-400">{h.area}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditHostel(h);
                      setShowEditModal(true);
                    }}
                    className="text-sm px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Update
                  </button>

                  {showEditModal && (
                    <EditHostelModal
                      hostel={editHostel}
                      closeModal={() => setShowEditModal(false)}
                      updateHostel={(updatedHostel) =>
                        setHostels(
                          hostels.map((h) =>
                            h.id === updatedHostel.id ? updatedHostel : h
                          )
                        )
                      }
                    />
                  )}


                  <button
                    onClick={() => deleteHostel(h.id)}
                    className="text-sm px-3 py-1 bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 bg-slate-600 rounded-lg hover:bg-slate-700"
          >
            Add New Hostel
          </button>
        </div>

        {showAddModal && (
          <AddHostelModal
            closeModal={() => setShowAddModal(false)}
            addHostel={(newHostel) => setHostels([...hostels, newHostel])}
            currentUser={currentUser}
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
                  key={q.id}
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

/* ===================== Pending Question Component ===================== */

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
          onClick={() => {
            if (text.trim() !== "") {
              submitAnswer(q.hostelId, q.id, text.trim());
              setText(""); // clear after submit
            }
          }}
        >
          Reply
        </button>
      </div>
    </div>
  );
}
