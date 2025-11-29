import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getHostels } from "../services/hostelService";

export default function Compare() {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);

  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");

  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);

  const ref1 = useRef();
  const ref2 = useRef();

  // ------------------------------------------------ LOAD ALL HOSTELS
  useEffect(() => {
    const loadHostels = async () => {
      try {
        const data = await getHostels();
        setHostels(data);
      } catch {
        setError("Failed to load hostels");
      } finally {
        setLoading(false);
      }
    };
    loadHostels();
  }, []);

  // ------------------------------------------------ CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref1.current && !ref1.current.contains(e.target)) setDropdown1Open(false);
      if (ref2.current && !ref2.current.contains(e.target)) setDropdown2Open(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calcAvgRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "N/A";
    const total = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const filtered1 = hostels.filter(
    (h) =>
      h.name.toLowerCase().includes(search1.toLowerCase()) &&
      (!selected2 || h._id !== selected2._id)
  );

  const filtered2 = hostels.filter(
    (h) =>
      h.name.toLowerCase().includes(search2.toLowerCase()) &&
      (!selected1 || h._id !== selected1._id)
  );

  // ------------------------------------------------ LOADING SCREEN
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center p-8">
        <p className="text-gray-300 text-lg animate-pulse">Loading comparison...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate("/hostels")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Hostels
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          Compare Hostels
        </h1>

        {/* ------------------------------------------------ HOSTEL SELECTORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* HOSTEL 1 */}
          <div ref={ref1} className="relative">
            <label className="text-white font-semibold mb-2 block">Select Hostel 1</label>
            <input
              type="text"
              placeholder="Search hostel..."
              value={selected1 ? selected1.name : search1}
              onFocus={() => setDropdown1Open(true)}
              onChange={(e) => {
                setSelected1(null);
                setSearch1(e.target.value);
                setDropdown1Open(true);
              }}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
            />
            {dropdown1Open && (
              <div className="absolute z-50 w-full max-h-48 overflow-y-auto bg-gray-700 mt-1 rounded shadow-lg">
                {filtered1.map((h) => (
                  <div
                    key={h._id}
                    onClick={() => {
                      setSelected1(h);
                      setSearch1("");
                      setDropdown1Open(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-gray-200"
                  >
                    {h.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HOSTEL 2 */}
          <div ref={ref2} className="relative">
            <label className="text-white font-semibold mb-2 block">Select Hostel 2</label>
            <input
              type="text"
              placeholder="Search hostel..."
              value={selected2 ? selected2.name : search2}
              onFocus={() => setDropdown2Open(true)}
              onChange={(e) => {
                setSelected2(null);
                setSearch2(e.target.value);
                setDropdown2Open(true);
              }}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
            />
            {dropdown2Open && (
              <div className="absolute z-50 w-full max-h-48 overflow-y-auto bg-gray-700 mt-1 rounded shadow-lg">
                {filtered2.map((h) => (
                  <div
                    key={h._id}
                    onClick={() => {
                      setSelected2(h);
                      setSearch2("");
                      setDropdown2Open(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-gray-200"
                  >
                    {h.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------ ONE HOSTEL SELECTED */}
        {(selected1 && !selected2) || (!selected1 && selected2) ? (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl hover:shadow-indigo-500/20 transition">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={(selected1 || selected2).image}
                alt={(selected1 || selected2).name}
                className="w-full md:w-1/2 h-60 object-cover rounded-lg transform transition hover:scale-105"
              />
              <div className="flex-1">
                <h2 className="text-2xl text-white font-semibold">
                  {(selected1 || selected2).name}
                </h2>
                <p className="text-gray-300 mt-2 text-lg">
                  Rs {(selected1 || selected2).rent?.toLocaleString()}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      selected1 ? setSelected1(null) : setSelected2(null);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition transform hover:scale-105"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => navigate(`/hostel/${(selected1 || selected2)._id}`)}
                    className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600 transition transform hover:scale-105"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ------------------------------------------------ TWO HOSTELS SELECTED */}
        {selected1 && selected2 && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl p-4">
            {/* Clear All Button */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => {
                  setSelected1(null);
                  setSelected2(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition transform hover:scale-105 shadow-md"
              >
                Clear All
              </button>
            </div>

            {/* Comparison Table */}
            <table className="w-full">
              <thead className="bg-gray-700 text-white">
                <tr className="animate-fadeSlideDown">
                  <th className="p-4 text-left text-lg">Field</th>
                  {[selected1, selected2].map((h, idx) => (
                    <th key={idx} className="p-4 text-center">
                      <span className="text-lg font-semibold">{h.name}</span>
                      <div className="mt-3 flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/hostel/${h._id}`)}
                          className="px-4 py-1.5 text-xs rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105 transition shadow-md"
                        >
                          View
                        </button>
                        <button
                          onClick={() => (idx === 0 ? setSelected1(null) : setSelected2(null))}
                          className="px-4 py-1.5 text-xs rounded-full bg-red-600 text-white hover:bg-red-700 transform hover:scale-105 transition shadow-md"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-gray-300">
                {/* IMAGE */}
                <tr className="animate-row">
                  <td className="p-4">Image</td>
                  {[selected1, selected2].map((h, idx) => (
                    <td key={idx} className="p-4">
                      <div className="w-full aspect-video bg-gray-700 rounded overflow-hidden flex items-center justify-center">
                        {h.image ? (
                          <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                        ) : (
                          <p className="text-gray-300 text-lg italic">No Image Available</p>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* RENT */}
                <tr className="animate-row">
                  <td className="p-4">Monthly Rent</td>
                  <td className="p-4 text-center text-white">Rs {selected1.rent.toLocaleString()}</td>
                  <td className="p-4 text-center text-white">Rs {selected2.rent.toLocaleString()}</td>
                </tr>

                {/* RATING */}
                <tr className="animate-row">
                  <td className="p-4">Rating</td>
                  <td className="p-4 text-center text-white">⭐ {calcAvgRating(selected1.reviews)}</td>
                  <td className="p-4 text-center text-white">⭐ {calcAvgRating(selected2.reviews)}</td>
                </tr>

                {/* AREA */}
                <tr className="animate-row">
                  <td className="p-4">Area</td>
                  <td className="p-4 text-center text-white">{selected1.area}</td>
                  <td className="p-4 text-center text-white">{selected2.area}</td>
                </tr>

                {/* AMENITIES */}
                <tr className="animate-row">
                  <td className="p-4">Amenities</td>
                  {[selected1, selected2].map((h, idx) => (
                    <td key={idx} className="p-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {h.amenities?.map((a, i) => (
                          <span
                            key={i}
                            className="bg-indigo-600 px-2 py-1 rounded text-sm text-white shadow"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* WISHLIST */}
                <tr className="hover:bg-gray-700/40 transition-all hover:scale-[1.01] hover:shadow-xl">
                  <td className="p-4 text-gray-300 font-medium">Wishlisted </td>
                  <td className="p-4 text-center text-white">{selected1.shortlists || selected1.wishlistCount || 0}</td>
                  <td className="p-4 text-center text-white">{selected2.shortlists || selected2.wishlistCount || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
