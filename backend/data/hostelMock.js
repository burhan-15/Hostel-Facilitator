export const hostels = [
  {
    id: 1,
    name: "G-10 Boys Hostel",
    area: "G-10",
    rent: 15000,
    gender: "Male",
    profession: "Student",
    image: "https://placehold.co/600x400/4f46e5/ffffff?text=Modern+Hostel",
    description:
      "A modern and clean hostel perfect for students studying at nearby universities. Features high-speed internet, a dedicated study area, 24/7 security, and an in-house mess providing three meals a day.",
    amenities: ["Wi-Fi", "Laundry", "Mess", "Parking", "Security", "Study Area"],
    ownerId: 2,
    status: "approved",
    views: 250,
    shortlists: 45,
    nearbyUniversities: ["FAST", "NUML", "Riphah International University"],
    reviews: [
      {
        id: 201,
        userId: 1,
        rating: 5,
        text: "Great place to live! Very clean and the management is cooperative.",
      },
      {
        id: 202,
        userId: 4,
        rating: 4,
        text: "Good facilities, but the mess food could be better.",
      },
    ],
    questions: [
      {
        id: 101,
        userId: 1,
        text: "Is there a generator for backup power?",
        answer:
          "Yes, we have a 24/7 generator backup for all rooms and common areas.",
      },
    ],
  },

  {
    id: 2,
    name: "Blue Area Professionals Inn",
    area: "Blue Area",
    rent: 25000,
    gender: "Male",
    profession: "Professional",
    image: "https://placehold.co/600x400/0e7490/ffffff?text=City+View+Inn",
    description:
      "Executive accommodation for job holders in the heart of the city. Close to major corporate offices with premium facilities including AC rooms, daily housekeeping, and an attached cafe.",
    amenities: [
      "Wi-Fi",
      "AC Rooms",
      "Laundry",
      "Mess",
      "Parking",
      "Security",
      "Housekeeping",
    ],
    ownerId: 2,
    status: "approved",
    views: 180,
    shortlists: 30,
    nearbyUniversities: [
      "SZABIST",
      "Fazaia Medical College",
      "NUML",
    ],
    reviews: [],
    questions: [],
  },

  {
    id: 3,
    name: "F-11 Girls Dormitory",
    area: "F-11",
    rent: 18000,
    gender: "Female",
    profession: "Student",
    image: "https://placehold.co/600x400/be185d/ffffff?text=Girls+Dorm",
    description:
      "A very safe and secure environment for female students. Located in a peaceful residential area with easy access to markets and transport.",
    amenities: ["Wi-Fi", "Laundry", "Mess", "Security", "Common Room", "CCTV"],
    ownerId: 2,
    status: "approved",
    views: 310,
    shortlists: 60,
    nearbyUniversities: ["Bahria University", "Air University", "NUST"],
    reviews: [
      {
        id: 203,
        userId: 4,
        rating: 5,
        text: "Very safe and comfortable. The warden is very helpful.",
      },
    ],
    questions: [
      {
        id: 102,
        userId: 1,
        text: "What are the curfew timings?",
        answer: "The in-time is 10 PM sharp for all residents.",
      },
    ],
  },

  {
    id: 4,
    name: "I-8 Executive Lodges",
    area: "I-8",
    rent: 22000,
    gender: "Male",
    profession: "Professional",
    image: "https://placehold.co/600x400/15803d/ffffff?text=Executive+Stay",
    description:
      "Comfortable living for professionals with attached baths and kitchenettes.",
    amenities: ["Wi-Fi", "AC Rooms", "Parking", "Security", "Kitchenette"],
    ownerId: 2,
    status: "pending",
    views: 0,
    shortlists: 0,
    nearbyUniversities: ["Shifa College of Medicine", "Riphah International University"],
    reviews: [],
    questions: [],
  },

  {
    id: 5,
    name: "E-11 University Hostel",
    area: "E-11",
    rent: 12000,
    gender: "Male",
    profession: "Student",
    image: "https://placehold.co/600x400/a16207/ffffff?text=Campus+Living",
    description:
      "An affordable and budget-friendly option for students. Located near major universities, making the daily commute easy.",
    amenities: ["Wi-Fi", "Mess", "Parking", "Laundry"],
    ownerId: 2,
    status: "approved",
    views: 450,
    shortlists: 85,
    nearbyUniversities: ["Institute of Space Technology (IST)", "Air University", "PIEAS"],
    reviews: [
      {
        id: 204,
        userId: 1,
        rating: 4,
        text: "Value for money. Rooms are basic but clean.",
      },
    ],
    questions: [
      {
        id: 103,
        userId: 4,
        text: "Is there a laundry service?",
        answer: "Yes, laundry is available at an additional cost.",
      },
      {
        id: 104,
        userId: 1,
        text: "Do you provide transport to university?",
        answer: null,
      },
    ],
  },
];
