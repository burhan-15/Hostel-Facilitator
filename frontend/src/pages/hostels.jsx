import { useEffect, useRef, useState } from "react";
import HostelCard from "../Components/hostelcard";
import { getHostels } from "../services/hostelService";

export default function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [gender, setGender] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]); // multiple area tags
  const [areaInput, setAreaInput] = useState(""); // typing input
  const [profession, setProfession] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minRent, setMinRent] = useState(0);
  const [maxRent, setMaxRent] = useState(100000);

  // SEARCH STATES
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);

  // AREA TYPEAHEAD STATES
  const [availableAreas, setAvailableAreas] = useState([]);
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
  const [areaHighlightIndex, setAreaHighlightIndex] = useState(-1);
  const areaInputRef = useRef(null);
  const areaSuggestionsRef = useRef(null);

  // Nearby University filter states
  const [availableUnis, setAvailableUnis] = useState([]);
  const [selectedUnis, setSelectedUnis] = useState([]);
  const [uniInput, setUniInput] = useState("");
  const [uniSuggestions, setUniSuggestions] = useState([]);
  const [showUniSuggestions, setShowUniSuggestions] = useState(false);
  const [uniHighlightIndex, setUniHighlightIndex] = useState(-1);

  const uniInputRef = useRef(null);
  const uniSuggestionsRef = useRef(null);


  // LOAD HOSTELS INITIALLY
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getHostels();
        setHostels(data);
        setFilteredHostels(data);

        // Extract unique areas
        const uniqueAreas = [
          ...new Set(
            data.map((h) => h.area).filter((a) => typeof a === "string")
          ),
        ].sort();
        
        // Extract universities (all hostels have nearbyUniversities: [])
        const allUnis = data.flatMap(h => h.nearbyUniversities || []);
        const uniqueUnis = [...new Set(allUnis)].sort();
        setAvailableUnis(uniqueUnis);


        setAvailableAreas(uniqueAreas);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // CALCULATE AVG RATING
  const calcRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + Number(r?.rating || 0), 0);
    return total / reviews.length;
  };

  // APPLY FILTERS BUTTON LOGIC
  const applyFilters = () => {
    let result = [...hostels];

    if (gender) result = result.filter((h) => h.gender === gender);

    if (selectedAreas.length > 0)
      result = result.filter((h) => selectedAreas.includes(h.area));

    if (profession) result = result.filter((h) => h.profession === profession);

    // University filter
    if (selectedUnis.length > 0) {
      result = result.filter(
        h =>
          Array.isArray(h.nearbyUniversities) &&
          h.nearbyUniversities.some(u => selectedUnis.includes(u))
      );
    }

    result = result.filter((h) => h.rent >= minRent && h.rent <= maxRent);

    if (minRating) {
      result = result.filter((h) => calcRating(h.reviews) >= Number(minRating));
    }

    setFilteredHostels(result);
  };

  const resetFilters = () => {
    setGender("");
    setSelectedAreas([]);
    setAreaInput("");
    setProfession("");
    setMinRating("");
    setSelectedUnis([]);
    setUniInput("");
    setMinRent(0);
    setMaxRent(100000);
    setFilteredHostels(hostels);
  };

  // LIVE SEARCH (Independent)
  useEffect(() => {
    const q = searchText?.trim()?.toLowerCase() || "";

    if (!q) {
      setSearchResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matches = hostels.filter((h) => h.name?.toLowerCase().includes(q));

    setSuggestions(matches.slice(0, 6).map((m) => ({ name: m.name, id: m._id })));

    setSearchResults(matches);
    setShowSuggestions(true);
  }, [searchText, hostels]);

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        handleSuggestionClick(suggestions[highlightIndex].name);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name) => {
    setSearchText(name || "");
    const q = name?.toLowerCase() || "";

    const matches = hostels.filter((h) => h.name?.toLowerCase().includes(q));
    setSearchResults(matches);
    setShowSuggestions(false);
  };

  const handleSearchClick = () => {
    const q = searchText?.toLowerCase() || "";

    const matches = hostels.filter((h) => h.name?.toLowerCase().includes(q));

    setSearchResults(matches);
    setShowSuggestions(false);
  };

  // AREA TYPEAHEAD LOGIC
  useEffect(() => {
    const q = areaInput?.trim()?.toLowerCase() || "";

    if (!q) {
      setAreaSuggestions([]);
      setShowAreaSuggestions(false);
      return;
    }

    const matches = availableAreas.filter(
      (a) => a.toLowerCase().includes(q) && !selectedAreas.includes(a)
    );

    setAreaSuggestions(matches);
    setShowAreaSuggestions(true);
  }, [areaInput, availableAreas, selectedAreas]);

  const handleAreaKeyDown = (e) => {
    if (!showAreaSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAreaHighlightIndex((prev) =>
        prev < areaSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAreaHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (areaHighlightIndex >= 0) {
        selectArea(areaSuggestions[areaHighlightIndex]);
      } else if (areaSuggestions.length > 0) {
        selectArea(areaSuggestions[0]);
      }
    } else if (e.key === "Escape") {
      setShowAreaSuggestions(false);
    }
  };

  const selectArea = (value) => {
    setSelectedAreas((prev) => [...prev, value]);
    setAreaInput("");
    setShowAreaSuggestions(false);
  };

  const removeArea = (value) => {
    setSelectedAreas((prev) => prev.filter((a) => a !== value));
  };

  // UNIVERSITY TYPEAHEAD EFFECT
  useEffect(() => {
    const q = uniInput?.trim()?.toLowerCase() || "";

    if (!q) {
      setUniSuggestions([]);
      setShowUniSuggestions(false);
      return;
    }

    const matches = availableUnis.filter(
      (u) => u.toLowerCase().includes(q) && !selectedUnis.includes(u)
    );

    setUniSuggestions(matches);
    setShowUniSuggestions(true);
  }, [uniInput, availableUnis, selectedUnis]);

  const handleUniKeyDown = (e) => {
    if (!showUniSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setUniHighlightIndex((prev) =>
        prev < uniSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setUniHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (uniHighlightIndex >= 0) {
        selectUni(uniSuggestions[uniHighlightIndex]);
      } else if (uniSuggestions.length > 0) {
        selectUni(uniSuggestions[0]);
      }
    } else if (e.key === "Escape") {
      setShowUniSuggestions(false);
    }
  };

  const selectUni = (value) => {
    setSelectedUnis((prev) => [...prev, value]);
    setUniInput("");
    setShowUniSuggestions(false);
  };

  const removeUni = (value) => {
    setSelectedUnis((prev) => prev.filter((u) => u !== value));
  };


  // WHICH HOSTELS TO SHOW?
  const shownHostels =
    searchText?.trim()
      ? searchResults.filter((h) => h.status === "approved")
      : filteredHostels.filter((h) => h.status === "approved");

  if (loading) return <HostelsSkeleton />;

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white mb-4 text-center">
        Hostel Listings
      </h1>

      {/* SEARCH BAR */}
      <div className="mb-6 w-full max-w-3xl mx-auto">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value || "");
              setHighlightIndex(-1);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search hostels by name..."
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 pr-12"
          />

          <button
            onClick={handleSearchClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded bg-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-30 w-full bg-gray-800 border border-gray-700 rounded shadow-lg mt-2"
            >
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => handleSuggestionClick(s.name)}
                  className={`w-full text-left px-4 py-2 ${
                    i === highlightIndex ? "bg-[#0a1a3a]" : "hover:bg-gray-700"
                  } text-white`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-gray-800 p-4 rounded-lg max-w-6xl mx-auto mb-8">
        <h2 className="text-xl text-white mb-4">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gender */}
          <div>
            <label className="text-gray-300">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
            >
              <option value="">All</option>
              <option value="Male">Male Hostels</option>
              <option value="Female">Female Hostels</option>
            </select>
          </div>

          {/* AREA MULTI-TAG INPUT */}
          <div className="relative">
            <label className="text-gray-300">Area</label>
            <div
              className="flex flex-wrap items-center gap-1 mt-2 p-2 bg-gray-700 rounded cursor-text"
              onClick={() => areaInputRef.current.focus()}
            >
              {selectedAreas.map((area) => (
                <span
                  key={area}
                  className="bg-indigo-600 text-white px-2 rounded-full flex items-center gap-1"
                >
                  {area}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeArea(area);
                    }}
                    className="text-white font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                ref={areaInputRef}
                type="text"
                value={areaInput}
                onChange={(e) => {
                  setAreaInput(e.target.value || "");
                  setAreaHighlightIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (areaSuggestions.length > 0) {
                      selectArea(areaSuggestions[areaHighlightIndex >= 0 ? areaHighlightIndex : 0]);
                    } else if (areaInput.trim()) {
                      // allow adding custom area
                      selectArea(areaInput.trim());
                    }
                  } else if (e.key === "Backspace" && !areaInput && selectedAreas.length > 0) {
                    // remove last tag on Backspace
                    removeArea(selectedAreas[selectedAreas.length - 1]);
                  } else {
                    handleAreaKeyDown(e);
                  }
                }}
                placeholder="Search Areas"
                className="flex-1 bg-transparent text-white outline-none"
              />
            </div>

            {showAreaSuggestions && areaSuggestions.length > 0 && (
              <div
                ref={areaSuggestionsRef}
                className="absolute z-30 w-full bg-gray-800 border border-gray-700 rounded shadow-lg mt-1"
              >
                {areaSuggestions.map((a, i) => (
                  <button
                    key={a}
                    onClick={() => selectArea(a)}
                    className={`w-full text-left px-4 py-2 ${
                      i === areaHighlightIndex ? "bg-[#0a1a3a]" : "hover:bg-gray-700"
                    } text-white`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nearby University Filter */}
          <div className="relative">
            <label className="text-gray-300">Nearby University</label>

            <div
              className="flex flex-wrap items-center gap-1 mt-2 p-2 bg-gray-700 rounded cursor-text"
              onClick={() => uniInputRef.current.focus()}
            >
              {selectedUnis.map((uni) => (
                <span
                  key={uni}
                  className="bg-indigo-600 text-white px-2 rounded-full flex items-center gap-1"
                >
                  {uni}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeUni(uni);
                    }}
                    className="text-white font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                ref={uniInputRef}
                type="text"
                value={uniInput}
                onChange={(e) => {
                  setUniInput(e.target.value || "");
                  setUniHighlightIndex(-1);
                }}
                onKeyDown={handleUniKeyDown}
                placeholder="Search Universities"
                className="flex-1 bg-transparent text-white outline-none"
              />
            </div>

            {showUniSuggestions && uniSuggestions.length > 0 && (
              <div
                ref={uniSuggestionsRef}
                className="absolute z-30 w-full bg-gray-800 border border-gray-700 rounded shadow-lg mt-1"
              >
                {uniSuggestions.map((u, i) => (
                  <button
                    key={u}
                    onClick={() => selectUni(u)}
                    className={`w-full text-left px-4 py-2 ${
                      i === uniHighlightIndex ? "bg-[#0a1a3a]" : "hover:bg-gray-700"
                    } text-white`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profession */}
          <div>
            <label className="text-gray-300">Profession</label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
            >
              <option value="">All</option>
              <option value="Student">Student</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="text-gray-300">Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
            >
              <option value="">All</option>
              <option value="1">⭐ 1+</option>
              <option value="2">⭐⭐ 2+</option>
              <option value="3">⭐⭐⭐ 3+</option>
              <option value="4">⭐⭐⭐⭐ 4+</option>
              <option value="5">⭐⭐⭐⭐⭐ 5</option>
            </select>
          </div>

          {/* Rent Slider */}
          <div className="max-w-sm">
            <label className="text-gray-300 font-medium">Rent Range</label>

            <div className="flex justify-between text-gray-300 text-sm mt-2">
              <span>Rs {minRent}</span>
              <span>Rs {maxRent}</span>
            </div>

            <div
              className="relative mt-6 h-3 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = clickX / rect.width;
                let value = Math.round((percent * 100000) / 500) * 500;
                value = Math.max(0, Math.min(100000, value));

                const nearMin = Math.abs(value - minRent) < Math.abs(value - maxRent);

                if (nearMin && value <= maxRent) setMinRent(value);
                else if (!nearMin && value >= minRent) setMaxRent(value);
              }}
            >
              <div className="absolute w-full h-3 bg-gray-700 rounded-full"></div>

              <div
                className="absolute h-3 bg-indigo-500 rounded-full transition-all duration-150"
                style={{
                  left: `${(minRent / 100000) * 100}%`,
                  width: `${((maxRent - minRent) / 100000) * 100}%`,
                }}
              ></div>

              {/* MIN slider */}
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={minRent}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v <= maxRent) setMinRent(v);
                }}
                className="absolute w-full appearance-none bg-transparent pointer-events-none
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />

              {/* MAX slider */}
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={maxRent}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v >= minRent) setMaxRent(v);
                }}
                className="absolute w-full appearance-none bg-transparent pointer-events-none
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={applyFilters}
            className="bg-indigo-600 px-4 py-2 rounded text-white"
          >
            Apply Filters
          </button>

          <button
            onClick={resetFilters}
            className="bg-red-600 px-4 py-2 rounded text-white"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* RENDER HOSTELS */}
      <div className="max-w-6xl mx-auto">
        {shownHostels.length === 0 ? (
          <p className="text-gray-300 text-center">
            No hostels match your search/filters.
          </p>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {shownHostels.map((h) => (
              <HostelCard key={h._id || h.id} hostel={h} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HostelsSkeleton() {
  const placeholderHostels = Array.from({ length: 8 }); // number of hostel cards to show

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      {/* Title Skeleton */}
      <div className="h-12 w-1/3 bg-gray-700 rounded mx-auto mb-6 animate-pulse"></div>

      {/* Filters Skeleton */}
      <div className="bg-gray-800 p-4 rounded-lg max-w-6xl mx-auto mb-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-700 rounded"></div>
          ))}
        </div>
        <div className="flex gap-4 mt-6">
          <div className="h-10 w-32 bg-gray-700 rounded"></div>
          <div className="h-10 w-32 bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Hostel Cards Skeleton */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
        {placeholderHostels.map((_, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg p-4 animate-pulse space-y-2"
          >
            {/* Hostel Name */}
            <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
            {/* Hostel Area */}
            <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
            {/* Views & Shortlists */}
            <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            {/* Buttons */}
            <div className="flex gap-2 mt-3">
              <div className="h-8 w-16 bg-gray-700 rounded"></div>
              <div className="h-8 w-16 bg-gray-700 rounded"></div>
              <div className="h-8 w-20 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}