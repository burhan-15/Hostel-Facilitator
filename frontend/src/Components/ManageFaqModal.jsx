import { useState, useEffect } from "react";
import { getHostelById, addFaq, updateFaq, deleteFaq } from "../services/hostelService";

export default function ManageFaqModal({ isOpen, onClose, hostelId, currentUser }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const hostel = await getHostelById(hostelId);
        console.log(hostel);
        setFaqs(hostel.faqs || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        alert("Failed to fetch FAQs.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [isOpen, hostelId]);

  const handleAddFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      const data = await addFaq(hostelId, newQuestion, newAnswer);
      if (data.success) {
        setFaqs([...faqs, data.faq]);
        setNewQuestion("");
        setNewAnswer("");
      }
    } catch (error) {
      console.error("Failed to add FAQ:", error);
      alert(error.response?.data?.message || "Failed to add FAQ");
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaqId(faq._id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleUpdateFaq = async (faqId) => {
    try {
        await updateFaq(hostelId, faqId, editQuestion, editAnswer);
        setFaqs(faqs.map(f =>
        f._id === faqId ? { ...f, question: editQuestion, answer: editAnswer } : f
        ));
        setEditingFaqId(null);
        setEditQuestion("");
        setEditAnswer("");
    } catch (error) {
        console.error("Failed to update FAQ:", error);
        alert(error.response?.data?.message || "Failed to update FAQ");
    }
    };


  const handleDeleteFaq = async (faqId) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const data = await deleteFaq(hostelId, faqId);
      if (data.success) {
        setFaqs(faqs.filter(f => f._id !== faqId));
      }
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      alert(error.response?.data?.message || "Failed to delete FAQ");
    }
  };

  if (!isOpen) return null;

  const isOwner = currentUser?.role === "owner";

  return (
    <div className="fixed inset-0 z-50 flex items-center h-full justify-center bg-black bg-opacity-70">
      <div className="bg-gray-800 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Manage FAQs</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <p className="text-gray-300 mb-4">Loading FAQs...</p>
        ) : faqs.length === 0 ? (
          <p className="text-gray-400 mb-4">No FAQs added yet.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {faqs.map((f) => (
              <div key={f._id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                {editingFaqId === f._id ? (
                  <>
                    <input
                      className="w-full p-2 mb-2 rounded bg-gray-800 text-white border border-gray-600"
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                    />
                    <textarea
                      className="w-full p-2 mb-2 rounded bg-gray-800 text-white border border-gray-600"
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateFaq(f._id)}
                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingFaqId(null)}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-white">Q: {f.question}</p>
                    <p className="text-gray-300 mt-1">A: {f.answer}</p>
                    {isOwner && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleEditFaq(f)}
                          className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(f._id)}
                          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {isOwner && (
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold mb-2 text-white">Add New FAQ</h3>
            <input
              type="text"
              placeholder="Question"
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white border border-gray-600"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <textarea
              placeholder="Answer"
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white border border-gray-600"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <button
              onClick={handleAddFaq}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              Add FAQ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
