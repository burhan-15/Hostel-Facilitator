import { useState } from "react";
import { requestBoost } from "../services/hostelService";

export default function BoostModal({ hostelId, onClose, refreshHostels }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const packages = [
    { days: 7, price: 500 },
    { days: 15, price: 900 },
    { days: 30, price: 1500 },
  ];

  const handleBoostRequest = async (days) => {
    setLoading(true);
    setMessage("");
    try {
      await requestBoost(hostelId, days);
      setMessage(`Boost requested successfully for ${days} days!`);

      // Refresh the hostel list in parent
      if (refreshHostels) {
        await refreshHostels();
      }

      // Close the modal automatically
      onClose();
    } catch (error) {
      setMessage("Failed to request boost. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Boost Your Hostel</h2>
        {message && (
          <p className="text-center mb-4 text-green-600">{message}</p>
        )}
        <div className="flex flex-col gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.days}
              className="border p-4 rounded-lg flex justify-between items-center hover:bg-gray-600 cursor-pointer"
              onClick={() => handleBoostRequest(pkg.days)}
            >
              <div>
                <p className="font-semibold">{pkg.days} Days</p>
                <p className="text-white">Boost your hostel visibility</p>
              </div>
              <div>
                <p className="font-semibold">{pkg.price} PKR</p>
              </div>
            </div>
          ))}
        </div>

        {loading && <p className="mt-4 text-center text-gray-500">Processing...</p>}
      </div>
    </div>
  );
}
