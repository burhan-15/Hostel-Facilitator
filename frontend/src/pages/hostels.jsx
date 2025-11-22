import { useEffect, useState } from "react";
import HostelCard from "../Components/hostelcard";
import { getHostels } from "../services/hostelService";

export default function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHostels();
        setHostels(data);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const approvedHostels = hostels.filter((h) => h.status === "approved");

  if (loading) {
    return <p className="text-white text-center mt-10">Loading hostels...</p>;
  }

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
            <HostelCard key={hostel._id || hostel.id} hostel={hostel} />
          ))}
        </div>
      )}
    </div>
  );
}
