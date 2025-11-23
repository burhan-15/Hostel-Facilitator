import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../Components/AuthContext";
import { getHostelById, addQuestion, answerQuestion } from "../services/hostelService";
import { addReview, deleteReview } from "../services/hostelService";

export default function HostelDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

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
        } else {
          console.error("Hostel data is null");
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
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading hostel details...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
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
      const userId = typeof r.userId === 'object' ? String(r.userId._id || r.userId.id) : String(r.userId);
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

  const handleRemoveReview = async (reviewId) => {
    try {
      const result = await deleteReview(id, reviewId);
      if (result.success) {
        setReviews(reviews.filter((r) => r._id !== reviewId && r.id !== reviewId));
        setHostel(result.hostel);
      }
    } catch (error) {
      console.error("Error removing review:", error);
      alert(error.response?.data?.message || "Failed to remove review");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 pb-6 border-b border-gray-700">

            {/* Hostel Title */}
            <div>
              <h2 className="text-4xl font-bold">{hostel.name}</h2>
              <p className="text-md text-gray-400 mt-2 flex items-center">
                {hostel.area}, Islamabad
              </p>
            </div>

            {/* Right side price + rating */}
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
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
            <div className="lg:col-span-2">

              <img
                src={hostel.image}
                alt={hostel.name}
                className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
              />

              <h3 className="text-2xl font-semibold mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed mb-6">{hostel.description}</p>

              {hostel.nearbyUniversities && hostel.nearbyUniversities.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-2xl font-semibold mb-4">Nearby Universities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {hostel.nearbyUniversities.map((uni, i) => (
                      <div key={i} className="flex items-center text-gray-300">
                        <span className=" mr-2">⚪</span>
                        {uni}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-semibold mb-4 mt-4">Amenities</h3>
              {hostel.amenities && hostel.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {hostel.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center text-gray-300">
                      <span className="text-green-500 mr-2">✔</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mb-6">No amenities listed.</p>
              )}
            </div>

            {/* Hostel Information */}
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-bold mb-4">Hostel Information</h3>

              <div className="space-y-3 text-gray-200">
                <p className="flex justify-between">
                  <strong>Gender:</strong> {hostel.gender}
                </p>
                <p className="flex justify-between">
                  <strong>Profession:</strong> {hostel.profession}
                </p>
              </div>

              {!currentUser && (
                <p className="mt-6 text-center text-sm text-gray-300 p-4 bg-gray-800 rounded-md">
                  Please log in to review or ask questions.
                </p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`py-4 px-1 border-b-2 font-medium ${
                    selectedTab === "reviews"
                      ? "text-slate-300 border-slate-500"
                      : "text-gray-500 hover:text-gray-300 hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedTab("reviews")}
                >
                  Reviews
                </button>

                <button
                  className={`py-4 px-1 border-b-2 font-medium ${
                    selectedTab === "questions"
                      ? "text-slate-300 border-slate-500"
                      : "text-gray-500 hover:text-gray-300 hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedTab("questions")}
                >
                  Questions
                </button>
              </nav>
            </div>

            {/* Reviews Tab */}
            {selectedTab === "reviews" && (
              <div className="py-6">
                {currentUser?.role === "user" && !userHasReviewed && (
                  <ReviewForm onSubmit={handleAddReview} />
                )}
                <div className="space-y-4 mt-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => {
                      const userName = typeof review.userId === 'object' 
                        ? (review.userId.name || "Anonymous")
                        : "Anonymous";
                      const reviewId = review._id || review.id;

                      return (
                        <div
                          key={reviewId}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-700"
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

                            {currentUser?.role === "admin" && (
                              <button
                                onClick={() => handleRemoveReview(reviewId)}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <p className="text-gray-300">{review.text}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 mt-4">
                      No reviews yet. Be the first to write one!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Questions Tab */}
            {selectedTab === "questions" && (
              <div className="py-6">
                {currentUser && currentUser.role === "user" && (
                  <QuestionForm onSubmit={handleAddQuestion} />
                )}
                <div className="space-y-4">
                  {questions.length > 0 ? (
                    questions.map((q) => {
                      const questionId = q._id || q.id;
                      const userName = typeof q.userId === 'object' 
                        ? (q.userId.name || "Anonymous")
                        : "Anonymous";
                      const isOwner = currentUser && (
                        currentUser.role === "owner" || currentUser.role === "admin"
                      ) && hostel.ownerId && (
                        typeof hostel.ownerId === 'object' 
                          ? String(hostel.ownerId._id || hostel.ownerId.id) === String(currentUser.id)
                          : String(hostel.ownerId) === String(currentUser.id)
                      );

                      return (
                        <div
                          key={questionId}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-700"
                        >
                          <p className="font-semibold text-white">
                            Q: {q.text}
                          </p>
                          <p className="text-sm text-gray-400 mb-2">
                            Asked by {userName}
                          </p>

                          {q.answer ? (
                            <div className="mt-2 pl-4 border-l-2 border-slate-500">
                              <p className="font-semibold text-white">A: {q.answer}</p>
                              <p className="text-sm text-gray-400">Answered by Hostel Owner</p>
                            </div>
                          ) : isOwner ? (
                            <AnswerForm 
                              hostelId={id} 
                              questionId={questionId}
                              onAnswer={(answer) => {
                                const handleAnswer = async () => {
                                  try {
                                    const result = await answerQuestion(id, questionId, answer);
                                    if (result.success) {
                                      setQuestions(result.hostel.questions || []);
                                      setHostel(result.hostel);
                                    }
                                  } catch (error) {
                                    console.error("Error answering question:", error);
                                    alert(error.response?.data?.message || "Failed to answer question");
                                  }
                                };
                                handleAnswer();
                              }}
                            />
                          ) : (
                            <p className="mt-2 pl-4 text-sm text-gray-500 italic">
                              Awaiting answer from owner...
                            </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Review Form ---
function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  return (
    <div className="mb-6 bg-gray-700 p-4 rounded-lg border border-gray-600">
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
        className="mt-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
      >
        Submit
      </button>
    </div>
  );
}

// --- Question Form ---
function QuestionForm({ onSubmit }) {
  const [text, setText] = useState("");

  return (
    <div className="mb-6 bg-gray-700 p-4 rounded-lg border border-gray-600">
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
        className="mt-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
      >
        Submit Question
      </button>
    </div>
  );
}

// --- Answer Form ---
function AnswerForm({ hostelId, questionId, onAnswer }) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="mt-2">
      <textarea
        rows="2"
        className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md"
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button
        onClick={() => {
          if (answer.trim()) {
            onAnswer(answer);
            setAnswer("");
          }
        }}
        className="mt-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm"
      >
        Submit Answer
      </button>
    </div>
  );
}
