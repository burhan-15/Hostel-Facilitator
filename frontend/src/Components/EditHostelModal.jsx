import { useState } from "react";
import { updateHostel as updateHostelAPI } from "../services/hostelService";

export default function EditHostelModal({ hostel, closeModal, updateHostel }) {

  // Pre-fill form values from hostel
  const [name, setName] = useState(hostel.name);
  const [area, setArea] = useState(hostel.area);
  const [rent, setRent] = useState(hostel.rent);
  const [gender, setGender] = useState(hostel.gender);
  const [profession, setProfession] = useState(hostel.profession);
  const [desc, setDesc] = useState(hostel.description);

  const amenityList = [
    "Wi-Fi",
    "Laundry",
    "Mess",
    "Parking",
    "Security",
    "AC Rooms",
    "CCTV",
    "Housekeeping",
    "Study Area",
    "Common Room",
    "Kitchenette",
  ];

  const [amenities, setAmenities] = useState(hostel.amenities);

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hostelId = hostel._id || hostel.id;
      const updated = {
        name,
        area,
        rent,
        gender,
        profession,
        description: desc,
        amenities,
      };

      await updateHostelAPI(hostelId, updated);
      updateHostel(); // Refresh the list
      closeModal();
    } catch (error) {
      console.error("Error updating hostel:", error);
      alert(error.response?.data?.message || "Failed to update hostel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-gray-800
          rounded-lg
          shadow-xl
          w-full
          max-w-lg
          p-6
          border border-gray-700
          max-h-[80vh]
          overflow-y-auto
        "
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Update Hostel Details
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name & Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Hostel Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
                required
              />
            </div>
          </div>

          {/* Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Monthly Rent (PKR)
            </label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
              required
            />
          </div>

          {/* Gender & Profession */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Profession
              </label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
              >
                <option>Student</option>
                <option>Professional</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              rows="3"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
              required
            ></textarea>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amenities
            </label>

            <div className="grid grid-cols-2 gap-2">
              {amenityList.map((a) => (
                <label key={a} className="flex items-center text-gray-300 space-x-2">
                  <input
                    type="checkbox"
                    checked={amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                    className="w-4 h-4 accent-slate-600"
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
