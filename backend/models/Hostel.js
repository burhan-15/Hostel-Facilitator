import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hostel name is required"],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "Area is required"],
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, "Rent is required"],
      min: [0, "Rent cannot be negative"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female"],
    },
    profession: {
      type: String,
      required: [true, "Profession is required"],
      enum: ["Student", "Professional", "Both"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "https://placehold.co/600x400/4f46e5/ffffff?text=Hostel+Image",
    },
    amenities: {
      type: [String],
      default: [],
    },

    nearbyUniversities: {
      type: [String],
      enum: [
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
        "Islamabad Medical & Dental College (IMDC)",
      ],
      default: [],
    },

    views: {
      type: Number,
      default: 0,
    },

    shortlists: {
      type: Number,
      default: 0,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    questions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        answer: {
          type: String,
          default: null,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        answeredAt: {
          type: Date,
          default: null,
        },
      },
    ],

    faqs: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },
        answer: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Hostel", hostelSchema);
