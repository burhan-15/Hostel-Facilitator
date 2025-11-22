import { useParams } from "react-router-dom";
import { hostels } from "../data/hostelMock";
import { users } from "../data/users";
import { useState } from "react";
import { useAuth } from "../Components/AuthContext";

export default function HostelDetail() {
  const { id } = useParams();
  const hostel = hostels.find((h) => h.id === Number(id));
  const { currentUser } = useAuth();

  const [selectedTab, setSelectedTab] = useState("reviews");
  const [reviews, setReviews] = useState(hostel.reviews);
  const [questions, setQuestions] = useState(hostel.questions);

  if (!hostel) return <p className="text-white p-6">Hostel not found</p>;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "N/A";

  const userHasReviewed =
    currentUser && reviews.some((r) => r.userId === currentUser.id);

  const addReview = (rating, text) => {
    const newReview = {
      id: Date.now(),
      userId: currentUser.id,
      rating,
      text,
    };
    setReviews([newReview, ...reviews]);
  };

  const addQuestion = (text) => {
    const newQ = {
      id: Date.now(),
      userId: currentUser.id,
      text,
      answer: null,
    };
    setQuestions([newQ, ...questions]);
  };

  const removeReview = (reviewId) => {
    setReviews(reviews.filter((r) => r.id !== reviewId));
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

              <h3 className="text-2xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {hostel.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center text-gray-300">
                    <span className="text-green-500 mr-2">✔</span>
                    {amenity}
                  </div>
                ))}
              </div>
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

                {/* Review form */}
                {currentUser?.role === "user" && !userHasReviewed && (
                  <ReviewForm onSubmit={addReview} />
                )}

                {/* Review list */}
                <div className="space-y-4 mt-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => {
                      const user = users.find((u) => u.id === review.userId);

                      return (
                        <div
                          key={review.id}
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
                              <p className="ml-3 font-semibold text-white">
                                {user ? user.name : "Anonymous"}
                              </p>
                            </div>

                            {/* Admin delete */}
                            {currentUser?.role === "admin" && (
                              <button
                                onClick={() => removeReview(review.id)}
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

                {/* Ask question */}
                {currentUser && currentUser.role === "user" && (
                  <QuestionForm onSubmit={addQuestion} />
                )}

                {/* Q&A list */}
                <div className="space-y-4">
                  {questions.length > 0 ? (
                    questions.map((q) => {
                      const user = users.find((u) => u.id === q.userId);

                      return (
                        <div
                          key={q.id}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-700"
                        >
                          <p className="font-semibold text-white">
                            Q: {q.text}
                          </p>
                          <p className="text-sm text-gray-400 mb-2">
                            Asked by {user?.name || "Anonymous"}
                          </p>

                          {q.answer ? (
                            <div className="mt-2 pl-4 border-l-2 border-slate-500">
                              <p className="font-semibold text-white">
                                A: {q.answer}
                              </p>
                              <p className="text-sm text-gray-400">
                                Answered by Hostel Owner
                              </p>
                            </div>
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
        onClick={() => onSubmit(text)}
        className="mt-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
      >
        Submit Question
      </button>
    </div>
  );
}
