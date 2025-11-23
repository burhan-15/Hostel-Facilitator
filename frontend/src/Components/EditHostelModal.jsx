import { useState } from "react";
import { updateHostel as updateHostelAPI } from "../services/hostelService";

export default function EditHostelModal({ hostel, closeModal, updateHostel }) {
  // Pre-fill values
  const [name, setName] = useState(hostel.name);
  const [area, setArea] = useState(hostel.area);
  const [rent, setRent] = useState(hostel.rent);
  const [gender, setGender] = useState(hostel.gender);
  const [profession, setProfession] = useState(hostel.profession);
  const [desc, setDesc] = useState(hostel.description);
  const [amenities, setAmenities] = useState(hostel.amenities || []);

  // NEW FIELD: nearby universities
  const universityOptions = [
    "NUST",
    "FAST",
    "COMSATS",
    "Air University",
    "Bahria University",
    "Quaid-e-Azam University (QAU)",
    "Riphah International University",
    "SZABIST",
    "Institute of Space Technology (IST)",
    "PIEAS",
    "Al-Nafees Medical College",
    "Fazaia Medical College",
    "Shifa College of Medicine",
    "HBS Medical College",
    "Islamabad Medical & Dental College (IMDC)"
  ];

  const [nearbyUniversities, setNearbyUniversities] = useState(
    hostel.nearbyUniversities || []
  );

  const toggleUniversity = (uni) => {
    setNearbyUniversities((prev) =>
      prev.includes(uni)
        ? prev.filter((u) => u !== uni)
        : [...prev, uni]
    );
  };

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
        nearbyUniversities, // NEW FIELD INCLUDED
      };

      await updateHostelAPI(hostelId, updated);
      updateHostel();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update hostel");
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
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-gray-700 max-h-[80vh] overflow-y-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Update Hostel Details</h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name and Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300">Hostel Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300">Area</label>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
                required
              />
            </div>
          </div>

          {/* Rent */}
          <div>
            <label className="block text-sm text-gray-300">Monthly Rent (PKR)</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
            />
          </div>

          {/* Gender + Profession */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300">Profession</label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
              >
                <option>Student</option>
                <option>Professional</option>
                <option>Both</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300">Description</label>
            <textarea
              rows="3"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
            ></textarea>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {amenityList.map((a) => (
                <label key={a} className="flex items-center text-gray-300 space-x-2">
                  <input
                    type="checkbox"
                    checked={amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                    className="w-4 h-4"
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* NEW SECTION — Nearby Universities */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nearby Universities</label>
            <div className="grid grid-cols-2 gap-2">
              {universityOptions.map((u) => (
                <label key={u} className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={nearbyUniversities.includes(u)}
                    onChange={() => toggleUniversity(u)}
                    className="w-4 h-4"
                  />
                  <span>{u}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
