import { useAuth } from "../Components/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserReviews, getUserQuestions } from "../services/hostelService";

export default function UserDashboard() {
  const { currentUser, logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const [userReviews, userQuestions] = await Promise.all([
          getUserReviews(),
          getUserQuestions(),
        ]);

        // Sort both by created date
        const reviewsWithType = userReviews.map((r) => ({
          ...r,
          type: "review",
          date: r.createdAt || r.askedAt,
        }));
        const questionsWithType = userQuestions.map((q) => ({
          ...q,
          type: "question",
          date: q.askedAt,
        }));

        const combinedActivity = [
          ...reviewsWithType,
          ...questionsWithType,
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setReviews(combinedActivity.filter((a) => a.type === "review"));
        setQuestions(combinedActivity.filter((a) => a.type === "question"));
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  // Protect route
  if (!currentUser || currentUser.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      {" "}
      <div className="max-w-5xl mx-auto">
        {" "}
        {/* Header Section */}{" "}
        <div className="flex justify-between items-center mb-10">
          {" "}
          <h1 className="text-4xl font-bold">User Dashboard</h1>{" "}
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white"
          >
            {" "}
            Logout{" "}
          </button>{" "}
        </div>{" "}
        {/* User Info Card */}{" "}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10">
          {" "}
          <h2 className="text-2xl font-semibold mb-3">Your Profile</h2>{" "}
          <p className="text-gray-300">
            <strong>Name:</strong> {currentUser.name}
          </p>{" "}
          <p className="text-gray-300">
            <strong>Email:</strong> {currentUser.email}
          </p>{" "}
          <p className="text-gray-300">
            <strong>Role:</strong> {currentUser.role}
          </p>{" "}
        </div>{" "}
        {/* Saved Hostels Placeholder */}{" "}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10">
          {" "}
          <h2 className="text-2xl font-semibold mb-3">Saved Hostels</h2>{" "}
          <p className="text-gray-400">You haven't saved any hostels yet.</p>{" "}
        </div>{" "}
        {/* Recent Activity */}{" "}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          {" "}
          <h2 className="text-2xl font-semibold mb-5">Recent Activity</h2>{" "}
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : reviews.length === 0 && questions.length === 0 ? (
            <p className="text-gray-400">No recent activity yet.</p>
          ) : (
            <div className="space-y-6">
              {" "}
              {/* Reviews */}{" "}
              {reviews.length > 0 && (
                <div>
                  {" "}
                  <h3 className="text-xl font-semibold mb-2">
                    Your Reviews
                  </h3>{" "}
                  <ul className="space-y-3">
                    {" "}
                    {reviews.map((rev) => (
                      <li
                        key={rev.reviewId}
                        className="border border-gray-700 rounded-lg p-3 bg-gray-850"
                      >
                        {" "}
                        <p>
                          <strong>Hostel:</strong> {rev.hostelName}
                        </p>{" "}
                        <p>
                          <strong>Rating:</strong> {rev.rating} ⭐
                        </p>{" "}
                        <p className="text-gray-300">{rev.text}</p>{" "}
                      </li>
                    ))}{" "}
                  </ul>{" "}
                </div>
              )}{" "}
              {/* Questions */}{" "}
              {questions.length > 0 && (
                <div>
                  {" "}
                  <h3 className="text-xl font-semibold mb-2">
                    Your Questions
                  </h3>{" "}
                  <ul className="space-y-3">
                    {" "}
                    {questions.map((q) => (
                      <li
                        key={q._id}
                        className="border border-gray-700 rounded-lg p-3 bg-gray-850"
                      >
                        {" "}
                        <p>
                          <strong>Hostel:</strong> {q.hostelName}
                        </p>{" "}
                        <p className="text-gray-300">{q.question}</p>{" "}
                        <p className="text-gray-300">
                          {q.answer ? `Ans: ${q.answer}` : "Not Answered Yet"}
                        </p>
                        {console.log(q)}
                      </li>
                    ))}{" "}
                  </ul>{" "}
                </div>
              )}{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
