export const hostels = [
  {
    id: 1,
    name: "G-10 Boys Hostel",
    area: "G-10",
    rent: 15000,
    gender: "Male",
    profession: "Student",
    image: "https://placehold.co/600x400/4f46e5/ffffff?text=Modern+Hostel",
    description: "A modern and clean hostel perfect for students studying at nearby universities.",
    contact: "0333-1234561",
    amenities: ["Wi-Fi", "Laundry", "Mess", "Parking", "Security", "Study Area"],
    ownerId: 2,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["FAST", "NUML", "Riphah International University"],
    reviews: [
      { id: 201, userId: 1, rating: 5, text: "Great place to live! Very clean and cooperative management." },
      { id: 202, userId: 4, rating: 4, text: "Good facilities, but the mess food could be better." }
    ],
    questions: [
      { id: 101, userId: 1, text: "Is there a generator for backup power?", answer: "Yes, 24/7 backup available." }
    ],
    faqs: [
      { id: 1, question: "Are visitors allowed?", answer: "Yes, with security permission." },
      { id: 2, question: "Is Wi-Fi unlimited?", answer: "Yes, unlimited high-speed Wi-Fi included." }
    ],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },
  {
    id: 2,
    name: "Blue Area Professionals Inn",
    area: "Blue Area",
    rent: 25000,
    gender: "Male",
    profession: "Professional",
    image: "https://placehold.co/600x400/0e7490/ffffff?text=City+View+Inn",
    description: "Executive accommodation for job holders in the heart of the city.",
    contact: "0333-1234562",
    amenities: ["Wi-Fi", "AC Rooms", "Laundry", "Mess", "Parking", "Security", "Housekeeping"],
    ownerId: 2,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["SZABIST", "Fazaia Medical College", "NUML"],
    reviews: [
      { id: 203, userId: 4, rating: 5, text: "Excellent for professionals!" }
    ],
    questions: [],
    faqs: [
      { id: 1, question: "Is housekeeping included?", answer: "Yes, daily housekeeping is included." }
    ],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },
  {
    id: 3,
    name: "F-11 Girls Dormitory",
    area: "F-11",
    rent: 18000,
    gender: "Female",
    profession: "Student",
    image: "https://placehold.co/600x400/be185d/ffffff?text=Girls+Dorm",
    description: "A very safe and secure environment for female students.",
    contact: "0333-1234563",
    amenities: ["Wi-Fi", "Laundry", "Mess", "Security", "Common Room", "CCTV"],
    ownerId: 2,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["Bahria University", "Air University", "NUST"],
    reviews: [],
    questions: [
      { id: 102, userId: 1, text: "What are the curfew timings?", answer: "The in-time is 10 PM sharp for all residents." }
    ],
    faqs: [],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },
  {
    id: 4,
    name: "I-8 Executive Lodges",
    area: "I-8",
    rent: 22000,
    gender: "Male",
    profession: "Professional",
    image: "https://placehold.co/600x400/15803d/ffffff?text=Executive+Stay",
    description: "Comfortable living for professionals with attached baths and kitchenettes.",
    contact: "0333-1234564",
    amenities: ["Wi-Fi", "AC Rooms", "Parking", "Security", "Kitchenette"],
    ownerId: 2,
    status: "pending",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["Shifa College of Medicine", "Riphah International University"],
    reviews: [],
    questions: [],
    faqs: [
      { id: 1, question: "Is kitchen usage allowed?", answer: "Yes, each room has a private kitchenette." },
      { id: 2, question: "Are guests allowed overnight?", answer: "No, overnight guests are not allowed." }
    ],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },
  {
    id: 5,
    name: "E-11 University Hostel",
    area: "E-11",
    rent: 12000,
    gender: "Male",
    profession: "Student",
    image: "https://placehold.co/600x400/a16207/ffffff?text=Campus+Living",
    description: "An affordable and budget-friendly option for students.",
    contact: "0333-1234565",
    amenities: ["Wi-Fi", "Mess", "Parking", "Laundry"],
    ownerId: 5,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["Institute of Space Technology (IST)", "Air University", "PIEAS"],
    reviews: [
      { id: 204, userId: 1, rating: 4, text: "Value for money. Rooms are clean." }
    ],
    questions: [
      { id: 103, userId: 4, text: "Is there a laundry service?", answer: "Yes, laundry is available at an additional cost." }
    ],
    faqs: [
      { id: 1, question: "Is laundry free?", answer: "Laundry is charged separately." }
    ],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },

  // Owner 5 hostels
  {
    id: 6,
    name: "D-12 Cozy Residency",
    area: "D-12",
    rent: 16000,
    gender: "Female",
    profession: "Student",
    image: "https://placehold.co/600x400/f97316/ffffff?text=Cozy+Residency",
    description: "Affordable and safe hostel for female students near major universities.",
    contact: "0333-1234566",
    amenities: ["Wi-Fi", "Laundry", "Mess", "Security"],
    ownerId: 5,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["NUST", "FAST"],
    reviews: [
      { id: 205, userId: 4, rating: 5, text: "Safe and well-maintained." }
    ],
    questions: [
      { id: 104, userId: 1, text: "Is Wi-Fi fast?", answer: "Yes, high-speed Wi-Fi included." }
    ],
    faqs: [],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },

  {
    id: 7,
    name: "F-9 Garden Hostel",
    area: "F-9",
    rent: 14000,
    gender: "Male",
    profession: "Student",
    image: "https://placehold.co/600x400/065f46/ffffff?text=Garden+Hostel",
    description: "Student hostel with garden view and peaceful environment.",
    contact: "0333-1234567",
    amenities: ["Wi-Fi", "Mess", "Parking", "Security"],
    ownerId: 5,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["NUML", "Air University"],
    reviews: [],
    questions: [],
    faqs: [
      { id: 2, question: "Are meals included?", answer: "No, optional subscription available." }
    ],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },

  {
    id: 8,
    name: "G-11 Student Haven",
    area: "G-11",
    rent: 13000,
    gender: "Male",
    profession: "Student",
    image: "https://placehold.co/600x400/7c3aed/ffffff?text=Student+Haven",
    description: "Budget-friendly hostel ideal for students.",
    contact: "0333-1234568",
    amenities: ["Wi-Fi", "Mess", "Laundry"],
    ownerId: 5,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["PIEAS", "Institute of Space Technology (IST)"],
    reviews: [],
    questions: [
      { id: 105, userId: 1, text: "Are visitors allowed?", answer: null }
    ],
    faqs: [],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },

  // Owner 6 hostels
  {
    id: 10,
    name: "I-10 Comfort Stay",
    area: "I-10",
    rent: 18000,
    gender: "Male",
    profession: "Professional",
    image: "https://placehold.co/600x400/0ea5e9/ffffff?text=Comfort+Stay",
    description: "Comfortable accommodation for working professionals.",
    contact: "0333-1234569",
    amenities: ["Wi-Fi", "AC Rooms", "Parking", "Security"],
    ownerId: 6,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: [],
    reviews: [],
    questions: [
      { id: 106, userId: 4, text: "Is parking available?", answer: "Yes, free parking included." }
    ],
    faqs: [],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },
  {
    id: 11,
    name: "F-7 Cozy Hub",
    area: "F-7",
    rent: 15000,
    gender: "Female",
    profession: "Student",
    image: "https://placehold.co/600x400/f43f5e/ffffff?text=Cozy+Hub",
    description: "Safe and affordable female hostel with common study area.",
    contact: "0333-1234570",
    amenities: ["Wi-Fi", "Mess", "Security", "Study Area"],
    ownerId: 6,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["NUST", "Bahria University"],
    reviews: [
      { id: 207, userId: 1, rating: 4, text: "Nice atmosphere." }
    ],
    questions: [],
    faqs: [
      { id: 3, question: "Is laundry included?", answer: "Laundry available at extra cost." }
    ],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },
  {
    id: 12,
    name: "G-10 Executive Rooms",
    area: "G-10",
    rent: 22000,
    gender: "Male",
    profession: "Professional",
    image: "https://placehold.co/600x400/15803d/ffffff?text=Executive+Rooms",
    description: "Premium rooms for professionals with modern facilities.",
    contact: "0333-1234571",
    amenities: ["Wi-Fi", "AC Rooms", "Parking", "Security", "Kitchenette"],
    ownerId: 6,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: [],
    reviews: [],
    questions: [],
    faqs: [],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  },
  {
    id: 13,
    name: "G-9 Student Lodge",
    area: "G-9",
    rent: 14000,
    gender: "Male",
    profession: "Student",
    image: "https://placehold.co/600x400/f59e0b/ffffff?text=Student+Lodge",
    description: "Affordable hostel for students close to universities.",
    contact: "0333-1234572",
    amenities: ["Wi-Fi", "Mess", "Laundry", "Parking"],
    ownerId: 6,
    status: "approved",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["FAST", "NUML"],
    reviews: [
      { id: 208, userId: 4, rating: 3, text: "Good location but small rooms." }
    ],
    questions: [
      { id: 107, userId: 1, text: "Is there Wi-Fi?", answer: "Yes, included." }
    ],
    faqs: [
      { id: 4, question: "Is parking free?", answer: "Yes, free parking available." }
    ],
    adBoost: { isBoosted: false, subscribedAt: null, expiresAt: null },
  }
];
