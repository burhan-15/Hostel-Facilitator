import HostelCard from "../Components/hostelcard";
import { hostels } from "../data/hostelMock";

export default function Hostels() {
  const approvedHostels = hostels.filter((h) => h.status === "approved");

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">
        Hostel Listings
      </h1>

      {approvedHostels.length === 0 ? (
        <p className="text-gray-300 text-center">No hostels available.</p>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {approvedHostels.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} />
          ))}
        </div>
      )}
    </div>
  );
}
