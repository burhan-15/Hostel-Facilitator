import { useEffect, useState } from "react";
import HostelCard from "../Components/hostelcard";
import { getHostels } from "../services/hostelService";

export default function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);

  const [loading, setLoading] = useState(true);

  // ===================== FILTER STATES =====================
  const [gender, setGender] = useState("");
  const [area, setArea] = useState("");
  const [minRent, setMinRent] = useState(0);
  const [maxRent, setMaxRent] = useState(100000);

  // Pre-defined areas
  const availableAreas = [
    "G-10", "G-9", "F-10", "F-11", "I-8",
    "I-10", "E-11", "PWD", "Bahria Town", "Satellite Town"
  ];

  // ===================== LOAD HOSTELS ONCE =====================
  useEffect(() => {
    const fetchAllHostels = async () => {
      try {
        setLoading(true);
        const data = await getHostels();
        setHostels(data);
        setFilteredHostels(data); // initial display
      } catch (error) {
        console.error("Error fetching hostels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHostels();
  }, []);

  // ===================== APPLY FILTERS =====================
  const applyFilters = () => {
    let results = [...hostels];

    if (gender) {
      results = results.filter(h => h.gender === gender);
    }

    if (area) {
      results = results.filter(h => h.area === area);
    }

    results = results.filter(h => h.rent >= minRent && h.rent <= maxRent);

    setFilteredHostels(results);
  };

  // Only show approved hostels
  const approvedHostels = filteredHostels.filter(h => h.status === "approved");

  if (loading) {
    return <p className="text-white text-center mt-10">Loading hostels...</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">
        Hostel Listings
      </h1>

      {/* ===================== FILTER UI ===================== */}
      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        <h2 className="text-xl text-white mb-4 font-semibold">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ---- Gender ---- */}
          <div>
            <label className="text-gray-300">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full mt-2 p-2 rounded bg-gray-700 text-white"
            >
              <option value="">All</option>
              <option value="Male">Male Hostels</option>
              <option value="Female">Female Hostels</option>
            </select>
          </div>

          {/* ---- Area ---- */}
          <div>
            <label className="text-gray-300">Area</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full mt-2 p-2 rounded bg-gray-700 text-white"
            >
              <option value="">All</option>
              {availableAreas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* ---- Dual Slider ---- */}
          <div className="max-w-sm">
            <label className="text-gray-300 font-medium">Rent Range</label>

            <div className="flex justify-between text-gray-300 text-sm mt-2">
              <span>Rs {minRent}</span>
              <span>Rs {maxRent}</span>
            </div>

            <div
              className="relative mt-6 h-3 cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = (clickX / rect.width) * 100;
                const rentValue = Math.round((percentage / 100) * 100000 / 500) * 500;

                if (Math.abs(rentValue - minRent) < Math.abs(rentValue - maxRent)) {
                  if (rentValue <= maxRent) setMinRent(rentValue);
                } else {
                  if (rentValue >= minRent) setMaxRent(rentValue);
                }
              }}
            >

              {/* Background Track */}
              <div className="absolute w-full h-3 bg-gray-700 rounded-full shadow-inner"></div>

              {/* Highlight Range */}
              <div
                className="absolute h-3 bg-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(99,102,241,0.7)]"
                style={{
                  left: `${(minRent / 100000) * 100}%`,
                  width: `${((maxRent - minRent) / 100000) * 100}%`,
                }}
              ></div>

              {/* MIN thumb */}
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={minRent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= maxRent) setMinRent(val);
                }}
                className="absolute w-full appearance-none bg-transparent pointer-events-none
                          [&::-webkit-slider-thumb]:pointer-events-auto
                          [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:w-5
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.7)]
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:duration-200
                          group-hover:[&::-webkit-slider-thumb]:scale-125
                          [&::-webkit-slider-thumb]:cursor-pointer"
              />

              {/* MAX thumb */}
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={maxRent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= minRent) setMaxRent(val);
                }}
                className="absolute w-full appearance-none bg-transparent pointer-events-none
                          [&::-webkit-slider-thumb]:pointer-events-auto
                          [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:w-5
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.7)]
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:duration-200
                          group-hover:[&::-webkit-slider-thumb]:scale-125
                          [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* APPLY + RESET BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={applyFilters}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Apply Filters
          </button>

          <button
            onClick={() => {
              setGender("");
              setArea("");
              setMinRent(0);
              setMaxRent(100000);
              setFilteredHostels(hostels);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Reset Filters
          </button>
        </div>

      </div>

      {/* ===================== HOSTELS LIST ===================== */}
      {approvedHostels.length === 0 ? (
        <p className="text-gray-300 text-center">No hostels match your filters.</p>
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
