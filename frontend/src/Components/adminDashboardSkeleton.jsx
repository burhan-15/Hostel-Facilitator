import React from "react";

export default function AdminDashboardSkeleton() {
  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ------------ STATS ------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* ------------ PENDING HOSTELS ------------- */}
        <SkeletonSection title="Pending Hostel Listings" items={3} />

        {/* ------------ BOOST REQUESTS ------------- */}
        <SkeletonSection title="Boost Requests" items={3} />

        {/* ------------ SALES STATS ------------- */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
          <h3 className="h-6 w-40 bg-gray-700 rounded"> </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>

        {/* ------------ RECENT REVIEWS ------------- */}
        <SkeletonSection title="Recent Ratings" items={3} />

        {/* ------------ FAQ MANAGEMENT ------------- */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
          <h3 className="h-6 w-40 bg-gray-700 rounded"> </h3>

          {/* Form Skeleton */}
          <div className="space-y-2">
            <div className="h-10 w-full bg-gray-700 rounded"></div>
            <div className="h-20 w-full bg-gray-700 rounded"></div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* FAQ list skeleton */}
          <div className="space-y-3">
            <SkeletonSection items={3} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- SKELETON COMPONENTS ----------------
function SkeletonCard() {
  return <div className="h-24 bg-gray-700 rounded-lg w-full animate-pulse"></div>;
}

function SkeletonSection({ title, items = 3 }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-3">
      {title && <h3 className="h-6 w-64 bg-gray-700 rounded mb-4 animate-pulse"> </h3>}
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-700 rounded w-full animate-pulse"></div>
      ))}
    </div>
  );
}
