import React from "react";

export default function OwnerDashboardSkeleton() {
  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* --- My Hostel Listings --- */}
        <SkeletonSection title="My Hostel Listings" items={3} />

        {/* --- Pending Questions Section --- */}
        <SkeletonSection title="Pending Questions" items={2} />

        {/* --- Scheduled Visits Section --- */}
        <SkeletonSection title="Scheduled Visits" items={3} />

      </div>
    </div>
  );
}

// ---------------- SKELETON COMPONENTS ----------------
function SkeletonSection({ title, items = 3 }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4 animate-pulse">
      {title && <h3 className="h-6 w-64 bg-gray-700 rounded mb-4"> </h3>}
      <div className="space-y-4">
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            className="p-4 border border-gray-700 rounded-lg bg-gray-700 space-y-2"
          >
            <div className="h-4 w-3/4 bg-gray-600 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-600 rounded"></div>
            <div className="h-3 w-1/3 bg-gray-600 rounded"></div>
            <div className="h-8 w-24 bg-gray-600 rounded mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
