import { useState } from "react";
import { createHostel } from "../services/hostelService";

export default function AddHostelModal({ closeModal, addHostel, currentUser }) {
  // Form state
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [rent, setRent] = useState("");
  const [gender, setGender] = useState("Male");
  const [profession, setProfession] = useState("Student");
  const [desc, setDesc] = useState("");
  const [contact, setContact] = useState(""); // <-- new state for contact

  // Amenity checklist
  const amenityList = [
    "Wi-Fi", "Laundry", "Mess", "Parking", "Security",
    "AC Rooms", "CCTV", "Housekeeping", "Study Area",
    "Common Room", "Kitchenette"
  ];

  const universityList = [
    "NUST",
    "FAST",
    "COMSATS",
    "NUML",
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

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedUnis, setSelectedUnis] = useState([]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleUniversity = (uni) => {
    setSelectedUnis((prev) =>
      prev.includes(uni)
        ? prev.filter((u) => u !== uni)
        : [...prev, uni]
    );
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hostelData = {
        name,
        area,
        rent: Number(rent),
        gender,
        profession,
        description: desc,
        contact, // <-- include contact in submission
        image: "https://placehold.co/600x400/4b5563/ffffff?text=New+Hostel",
        amenities: selectedAmenities,
        universitiesNearby: selectedUnis,
      };

      await createHostel(hostelData);
      addHostel();
      closeModal();
    } catch (error) {
      console.error("Error creating hostel:", error);
      alert(error.response?.data?.message || "Failed to create hostel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 flex items-center justify-center p-4 bg-black/75 m-0 z-50"
      onClick={closeModal}
    >
      <div
        className="modal bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-gray-700 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-4">List a New Hostel</h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME + AREA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Hostel Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Area</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
            </div>
          </div>

          {/* CONTACT NUMBER */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Contact Number</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="e.g. 0333-1234567"
              required
            />
          </div>

          {/* RENT */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Monthly Rent (PKR)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              required
            />
          </div>

          {/* GENDER + PROFESSION */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Gender</label>
              <select
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Profession</label>
              <select
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              >
                <option>Student</option>
                <option>Professional</option>
                <option>Both</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              rows="3"
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            ></textarea>
          </div>

          {/* AMENITIES */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {amenityList.map((amenity) => (
                <label key={amenity} className="flex items-center text-gray-300 space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="w-4 h-4 accent-slate-600"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* UNIVERSITIES CHECKLIST */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nearby Universities</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {universityList.map((uni) => (
                <label key={uni} className="flex items-center text-gray-300 space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUnis.includes(uni)}
                    onChange={() => toggleUniversity(uni)}
                    className="w-4 h-4 accent-slate-600"
                  />
                  <span>{uni}</span>
                </label>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
