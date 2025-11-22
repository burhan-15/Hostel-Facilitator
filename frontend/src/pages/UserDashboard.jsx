import { useAuth } from "../Components/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function UserDashboard() {
  const { currentUser, logout } = useAuth();

  // Protect route
  if (!currentUser || currentUser.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">

      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">User Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white"
          >
            Logout
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10">
          <h2 className="text-2xl font-semibold mb-3">Your Profile</h2>

          <p className="text-gray-300"><strong>Name:</strong> {currentUser.name}</p>
          <p className="text-gray-300"><strong>Email:</strong> {currentUser.email}</p>
          
          <p className="text-gray-300"><strong>Role:</strong> {currentUser.role}</p>
        </div>

        {/* Saved Hostels Placeholder */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10">
          <h2 className="text-2xl font-semibold mb-3">Saved Hostels</h2>
          <p className="text-gray-400">You haven't saved any hostels yet.</p>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-3">Recent Activity</h2>
          <p className="text-gray-400">No recent activity yet.</p>
        </div>

      </div>
    </div>
  );
}
