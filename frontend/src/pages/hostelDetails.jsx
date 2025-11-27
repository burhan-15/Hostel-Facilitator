import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../Components/AuthContext";
import { getHostelById, addQuestion, addReview, incrementViewCount, bookVisit } from "../services/hostelService";

export default function HostelDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        if (!id || id === "undefined") {
          console.error("Invalid hostel ID:", id);
          setLoading(false);
          return;
        }

        const hostelData = await getHostelById(id);
        if (hostelData) {
          setHostel(hostelData);
          setReviews(hostelData.reviews || []);
          setQuestions(hostelData.questions || []);
          setFaqs(hostelData.faqs || []);

          incrementViewCount(id).catch(err => console.error("Failed to increment views:", err));
        }
      } catch (error) {
        console.error("Error fetching hostel:", error);
        alert("Failed to load hostel details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center animate-fadeIn">
        <p className="text-white text-xl">Loading hostel details...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center animate-fadeIn">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Hostel not found</p>
          <a href="/hostels" className="text-slate-300 hover:text-white underline">
            Go back to hostels
          </a>
        </div>
      </div>
    );
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "N/A";

  const userHasReviewed =
    currentUser && reviews.some((r) => {
      const userId = typeof r.userId === "object" ? String(r.userId._id || r.userId.id) : String(r.userId);
      return userId === String(currentUser.id);
    });

  const handleAddReview = async (rating, text) => {
    try {
      const result = await addReview(id, rating, text);
      if (result.success) {
        setReviews(result.hostel.reviews || []);
        setHostel(result.hostel);
      }
    } catch (error) {
      console.error("Error adding review:", error);
      alert(error.response?.data?.message || "Failed to add review");
    }
  };

  const handleAddQuestion = async (text) => {
    try {
      const result = await addQuestion(id, text);
      if (result.success) {
        setQuestions(result.hostel.questions || []);
        setHostel(result.hostel);
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert(error.response?.data?.message || "Failed to add question");
    }
  };

  const handleBookVisit = async () => {
    if (!visitDate) return alert("Select a date");
    if (!visitTime) return alert("Select a time");

    const fullDateTime = `${visitDate}T${visitTime}:00`;

    try {
      const res = await bookVisit(id, fullDateTime);

      if (res.data.success) {
        alert("Visit booked!");
        setShowVisitModal(false);
      } else {
        alert(res.data.message || "Could not book a visit");
      }
    } catch (error) {
      console.error("BOOK VISIT ERROR:", error.response?.data || error.message);
      alert("Could not book a visit");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 animate-fadeIn">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 hover-glow">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 pb-6 border-b border-gray-700">

            {/* Hostel Title */}
            <div className="animate-slideUp">
              <h2 className="text-4xl font-bold">{hostel.name}</h2>
              <p className="text-md text-gray-400 mt-2 flex items-center">
                {hostel.area}, Islamabad
              </p>
            </div>

            {/* Right side price + rating */}
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end animate-slideUp">
              <p className="text-3xl font-bold">
                PKR {hostel.rent.toLocaleString()}
                <span className="text-lg font-normal text-gray-400"> / month</span>
              </p>

              <div className="flex items-center text-lg mt-1">
                <span className="text-yellow-400">⭐</span>
                <span className="ml-1 font-semibold">{avgRating}</span>
                <span className="ml-2 text-gray-400">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: IMAGE + DETAILS */}
            <div className="lg:col-span-2">
              <img
                src={hostel.image}
                alt={hostel.name}
                className="w-full h-96 object-cover rounded-lg shadow-md mb-6 transition-all duration-500 hover:scale-[1.02]"
              />

              <h3 className="text-2xl font-semibold mb-2 animate-slideUp">Description</h3>
              <p className="text-gray-300 leading-relaxed mb-6 animate-slideUp">{hostel.description}</p>

              {hostel.nearbyUniversities?.length > 0 && (
                <div className="mt-4 animate-slideUp">
                  <h3 className="text-2xl font-semibold mb-4">Nearby Universities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {hostel.nearbyUniversities.map((uni, i) => (
                      <div key={i} className="flex items-center text-gray-300 hover:text-white transition duration-300">
                        <span className="mr-2">⚪</span>
                        {uni}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-semibold mb-4 mt-4 animate-slideUp">Amenities</h3>
              {hostel.amenities?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 animate-slideUp">
                  {hostel.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center text-gray-300 hover:text-white transition duration-300">
                      <span className="text-green-500 mr-2">✔</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mb-6 animate-slideUp">No amenities listed.</p>
              )}
            </div>

            {/* RIGHT: INFORMATION CARD */}
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 transition-all duration-300 hover-glow animate-slideUp">
              <h3 className="text-xl font-bold mb-4">Hostel Information</h3>

              <div className="space-y-3 text-gray-200">
                <p className="flex justify-between"><strong>Gender:</strong> {hostel.gender}</p>
                <p className="flex justify-between"><strong>Profession:</strong> {hostel.profession}</p>
                <p className="flex justify-between"><strong>Contact:</strong> {hostel.contact}</p>
              </div>

              {/* Share Button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-all duration-300 hover:scale-105 hover-glow mt-4"
              >
                Share
              </button>

              {/* Visit Button */}
              {currentUser?.role === "user" && (
                <button
                  onClick={() => setShowVisitModal(true)}
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover-glow"
                >
                  Book a Visit
                </button>
              )}

              {!currentUser && (
                <p className="mt-6 text-center text-sm text-gray-300 p-4 bg-gray-800 rounded-md animate-slideUp">
                  Please log in to review or ask questions.
                </p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10 animate-slideUp">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {["reviews", "questions", "faqs"].map((tab) => (
                  <button
                    key={tab}
                    className={`py-4 px-1 border-b-2 font-medium transition-all duration-300 hover:scale-105 ${
                      selectedTab === tab
                        ? "text-slate-300 border-slate-500"
                        : "text-gray-500 hover:text-gray-300 hover:border-gray-500"
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Reviews */}
            {selectedTab === "reviews" && (
              <div className="py-6">
                {currentUser?.role === "user" && !userHasReviewed && (
                  <ReviewForm onSubmit={handleAddReview} />
                )}

                <div className="space-y-4 mt-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => {
                      const userName =
                        typeof review.userId === "object"
                          ? review.userId.name || "Anonymous"
                          : "Anonymous";
                      const reviewId = review._id || review.id;

                      return (
                        <div
                          key={reviewId}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-700 transition-all duration-300 hover-glow hover:scale-[1.01] animate-slideUp"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    ⭐
                                  </span>
                                ))}
                              </div>
                              <p className="ml-3 font-semibold text-white">{userName}</p>
                            </div>
                          </div>
                          <p className="text-gray-300">{review.text}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 mt-4">No reviews yet. Be the first to write one!</p>
                  )}
                </div>
              </div>
            )}

            {/* Questions */}
            {selectedTab === "questions" && (
              <div className="py-6">
                {currentUser?.role === "user" && <QuestionForm onSubmit={handleAddQuestion} />}

                <div className="space-y-4">
                  {questions.length > 0 ? (
                    questions.map((q) => {
                      const questionId = q._id || q.id;
                      const userName =
                        typeof q.userId === "object"
                          ? q.userId.name || "Anonymous"
                          : "Anonymous";

                      const isOwner =
                        currentUser &&
                        (currentUser.role === "owner" || currentUser.role === "admin") &&
                        hostel.ownerId &&
                        (typeof hostel.ownerId === "object"
                          ? String(hostel.ownerId._id || hostel.ownerId.id) === String(currentUser.id)
                          : String(hostel.ownerId) === String(currentUser.id));

                      return (
                        <div
                          key={questionId}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-700 transition-all duration-300 hover-glow hover:scale-[1.01] animate-slideUp"
                        >
                          <p className="font-semibold text-white">Q: {q.text}</p>
                          <p className="text-sm text-gray-400 mb-2">Asked by {userName}</p>

                          {q.answer ? (
                            <div className="mt-2 pl-4 border-l-2 border-slate-500">
                              <p className="font-semibold text-white">A: {q.answer}</p>
                              <p className="text-sm text-gray-400">Answered by Hostel Owner</p>
                            </div>
                          ) : isOwner ? (
                            <p className="mt-2 pl-4 text-sm text-gray-500 italic">Awaiting your answer...</p>
                          ) : (
                            <p className="mt-2 pl-4 text-sm text-gray-500 italic">Awaiting answer from owner...</p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400">No questions asked yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* FAQs */}
            {selectedTab === "faqs" && (
              <div className="py-6 animate-slideUp">
                <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>

                {faqs.length === 0 ? (
                  <p className="text-gray-400">No FAQs added for this hostel.</p>
                ) : (
                  <div className="space-y-4">
                    {faqs.map((f) => (
                      <div
                        key={f._id}
                        className="p-4 border border-gray-700 rounded-lg bg-gray-700 transition-all duration-300 hover-glow hover:scale-[1.01]"
                      >
                        <p className="font-semibold text-white">Q: {f.question}</p>
                        <p className="text-gray-300 mt-1">A: {f.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* VISIT MODAL */}
        {showVisitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm animate-fadeIn">
            <div className="bg-gray-800 p-6 rounded-xl w-96 border border-gray-700 shadow-xl transform animate-scaleIn">

              <h3 className="text-2xl font-semibold mb-4 text-white text-center">Book a Visit</h3>

              <label className="block text-gray-300 mb-1">Select Date:</label>
              <input
                type="date"
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 transition-all"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />

              <label className="block text-gray-300 mt-4 mb-1">Select Time:</label>
              <input
                type="time"
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 transition-all"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
              />

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 active:scale-95"
                  onClick={() => setShowVisitModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 active:scale-95"
                  onClick={handleBookVisit}
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SHARE MODAL */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center backdrop-blur-sm animate-fadeIn">
            <div className="bg-gray-800 p-6 rounded-lg w-96 border border-gray-600 shadow-xl animate-scaleIn">
              <h2 className="text-xl font-semibold mb-4 text-center">Share this Hostel</h2>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }}
                  className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  Copy Link
                </button>

                <a
                  href={`https://wa.me/?text=Check out this hostel: ${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  Share on WhatsApp
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  Share on Facebook
                </a>

                {navigator.share && (
                  <button
                    onClick={() =>
                      navigator.share({
                        title: "Hostel Listing",
                        text: "Check out this hostel!",
                        url: window.location.href,
                      })
                    }
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    Share via Device
                  </button>
                )}
              </div>

              <div className="text-center mt-5">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ------------------------ */
/* REVIEW FORM */
/* ------------------------ */
function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  return (
    <div className="mb-6 bg-gray-700 p-4 rounded-lg border border-gray-600 animate-slideUp transition-all duration-300 hover-glow">
      <h4 className="text-lg font-semibold mb-2">Write a Review</h4>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-300">Rating</label>
        <select
          className="w-full bg-gray-800 p-2 mt-1 rounded text-white border border-gray-600"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>
      </div>

      <textarea
        rows="3"
        className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md"
        placeholder="Share your experience..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={() => onSubmit(rating, text)}
        className="mt-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all duration-300 active:scale-95"
      >
        Submit
      </button>
    </div>
  );
}

/* ------------------------ */
/* QUESTION FORM */
/* ------------------------ */
function QuestionForm({ onSubmit }) {
  const [text, setText] = useState("");

  return (
    <div className="mb-6 bg-gray-700 p-4 rounded-lg border border-gray-600 animate-slideUp transition-all duration-300 hover-glow">
      <h4 className="text-lg font-semibold mb-2">Ask a Question</h4>

      <textarea
        rows="3"
        className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md"
        placeholder="Type your question here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={() => {
          if (text.trim()) {
            onSubmit(text);
            setText("");
          }
        }}
        className="mt-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all duration-300 active:scale-95"
      >
        Submit Question
      </button>
    </div>
  );
}
