import { useState, useEffect } from "react";
import { useAuth } from "../Components/AuthContext";
import { Navigate } from "react-router-dom";

import AddHostelModal from "../Components/addHostelModal";
import EditHostelModal from "../Components/EditHostelModal";
import { getMyHostels, deleteHostel, answerQuestion } from "../services/hostelService";

// FAQ services
import {
  getHostelFAQs,
  addHostelFAQ,
  updateHostelFAQ,
  deleteHostelFAQ,
} from "../services/ownerFaqService";


export default function OwnerDashboard() {
  const { currentUser } = useAuth();

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHostel, setEditHostel] = useState(null);
  // FAQ States
  const [hostelFaqs, setHostelFaqs] = useState({});
  const [faqEdits, setFaqEdits] = useState({});


  // Only owners allowed

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const data = await getMyHostels();
        setHostels(data);
        // Fetch FAQs for each hostel
        const faqsMap = {};
        for (const h of data) {
          const faqs = await getHostelFAQs(h._id || h.id);
          faqsMap[h._id || h.id] = faqs;
        }
        setHostelFaqs(faqsMap);

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

  // Extract unanswered questions
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

  // Delete hostel
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

  // Submit answer to a question
  const submitAnswer = async (hostelId, questionId, text) => {
    if (!text.trim()) return;

    try {
      const result = await answerQuestion(hostelId, questionId, text);
      if (result.success) {
        // Refresh hostels
        const data = await getMyHostels();
        setHostels(data);
      }
    } catch (error) {
      console.error("Error answering question:", error);
      alert(error.response?.data?.message || "Failed to answer question");
    }
  };

  const handleAddHostel = async () => {
    // Refresh hostels after adding
    const data = await getMyHostels();
    setHostels(data);
  };

  const handleUpdateHostel = async () => {
    // Refresh hostels after updating
    const data = await getMyHostels();
    setHostels(data);
  };

  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  // Add FAQ
  const handleAddFaq = async (hostelId) => {
    const form = faqEdits[hostelId];
    if (!form?.question?.trim() || !form.answer?.trim()) return;

    const newFaq = await addHostelFAQ(hostelId, form);

    setHostelFaqs((prev) => ({
      ...prev,
      [hostelId]: [newFaq, ...(prev[hostelId] || [])],
    }));

    setFaqEdits((prev) => ({
      ...prev,
      [hostelId]: { question: "", answer: "" },
    }));
  };

  // Edit FAQ
  const handleEditFaq = async (hostelId, faqId, updated) => {
    const editedFaq = await updateHostelFAQ(hostelId, faqId, updated);

    setHostelFaqs((prev) => ({
      ...prev,
      [hostelId]: prev[hostelId].map((f) =>
        f._id === faqId ? editedFaq : f
      ),
    }));
  };

  // Delete FAQ
  const handleDeleteFaq = async (hostelId, faqId) => {
    if (!window.confirm("Delete FAQ?")) return;

    await deleteHostelFAQ(hostelId, faqId);

    setHostelFaqs((prev) => ({
      ...prev,
      [hostelId]: prev[hostelId].filter((f) => f._id !== faqId),
    }));
  };


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
                <HostelCard
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
                    <p className="text-sm text-gray-400">{h.area}</p>
                    <p className="text-sm text-gray-400">Views: {h.views}</p>
                    <p className="text-sm text-gray-400">Shortlists: {h.shortlists}</p>
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

                    <button
                      onClick={() => handleDeleteHostel(hostelId)}
                      className="text-sm px-3 py-1 bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                  hostel={h}
                  hostelFaqs={hostelFaqs[hostelId] || []}
                  faqEdits={faqEdits}
                  setFaqEdits={setFaqEdits}
                  handleAddFaq={handleAddFaq}
                  handleEditFaq={handleEditFaq}
                  handleDeleteFaq={handleDeleteFaq}
                  setEditHostel={setEditHostel}
                  setShowEditModal={setShowEditModal}
                  handleDeleteHostel={handleDeleteHostel}
                />
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
          onClick={async () => {
            if (text.trim() !== "") {
              await submitAnswer(q.hostelId, q.questionId, text.trim());
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

function HostelCard({
  hostel,
  hostelFaqs,
  faqEdits,
  setFaqEdits,
  handleAddFaq,
  handleEditFaq,
  handleDeleteFaq,
  setEditHostel,
  setShowEditModal,
  handleDeleteHostel,
}) {
  const hostelId = hostel._id || hostel.id;
  const [openFaq, setOpenFaq] = useState(false);

  return (
    <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">{hostel.name}</p>
          <p className="text-sm text-gray-300">{hostel.area}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditHostel(hostel);
              setShowEditModal(true);
            }}
            className="px-3 py-1 bg-blue-600 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteHostel(hostelId)}
            className="px-3 py-1 bg-red-600 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      <button
        onClick={() => setOpenFaq(!openFaq)}
        className="mt-3 text-indigo-300 hover:underline"
      >
        {openFaq ? "Hide FAQs ▲" : "Manage FAQs ▼"}
      </button>

      {openFaq && (
        <div className="p-4 mt-3 bg-gray-800 rounded border border-gray-700">
          <h4 className="font-semibold text-lg mb-2">FAQs</h4>

          {hostelFaqs.length === 0 ? (
            <p className="text-gray-400 mb-3">No FAQs added yet.</p>
          ) : (
            hostelFaqs.map((faq) => (
              <FaqItem
                key={faq._id}
                faq={faq}
                hostelId={hostelId}
                handleEditFaq={handleEditFaq}
                handleDeleteFaq={handleDeleteFaq}
              />
            ))
          )}

          <div className="mt-4">
            <input
              type="text"
              placeholder="Question"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
              value={faqEdits[hostelId]?.question || ""}
              onChange={(e) =>
                setFaqEdits((prev) => ({
                  ...prev,
                  [hostelId]: {
                    ...prev[hostelId],
                    question: e.target.value,
                  },
                }))
              }
            />

            <textarea
              rows={2}
              placeholder="Answer"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
              value={faqEdits[hostelId]?.answer || ""}
              onChange={(e) =>
                setFaqEdits((prev) => ({
                  ...prev,
                  [hostelId]: {
                    ...prev[hostelId],
                    answer: e.target.value,
                  },
                }))
              }
            />

            <button
              className="px-4 py-2 bg-indigo-600 rounded"
              onClick={() => handleAddFaq(hostelId)}
            >
              Add FAQ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FaqItem({ faq, hostelId, handleEditFaq, handleDeleteFaq }) {
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState(faq.question);
  const [a, setA] = useState(faq.answer);

  return (
    <div className="bg-gray-700 p-3 rounded mb-2 border border-gray-600">
      {editing ? (
        <>
          <input
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded mb-2"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <textarea
            rows={2}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />

          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 bg-green-600 rounded"
              onClick={() => {
                handleEditFaq(hostelId, faq._id, { question: q, answer: a });
                setEditing(false);
              }}
            >
              Save
            </button>

            <button
              className="px-3 py-1 bg-gray-600 rounded"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-semibold">{faq.question}</p>
          <p className="text-gray-300">{faq.answer}</p>

          <div className="flex gap-3 mt-2">
            <button
              className="px-3 py-1 bg-yellow-600 rounded"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>

            <button
              className="px-3 py-1 bg-red-600 rounded"
              onClick={() => handleDeleteFaq(hostelId, faq._id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

