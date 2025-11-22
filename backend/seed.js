import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Hostel from "./models/Hostel.js";
import { users as dummyUsers } from "../my-app/src/data/users.js";
import { hostels as dummyHostels } from "../my-app/src/data/hostelMock.js";

dotenv.config();

const DB = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("MongoDB connected for seeding");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // 1️⃣ Clear existing data
    await User.deleteMany({});
    await Hostel.deleteMany({});

    // 2️⃣ Insert users
    const createdUsers = await User.insertMany(
      dummyUsers.map(u => ({
        name: u.name,
        email: u.email,
        password: u.password, // make sure your User model hashes if needed
        role: u.role,
      }))
    );

    // Map numeric IDs to MongoDB ObjectIds
    const userIdMap = {};
    createdUsers.forEach((user, idx) => {
      userIdMap[dummyUsers[idx].id] = user._id;
    });

    // 3️⃣ Insert hostels
    const hostelsToInsert = dummyHostels.map(h => ({
      name: h.name,
      area: h.area,
      rent: h.rent,
      gender: h.gender,
      profession: h.profession,
      description: h.description,
      image: h.image,
      amenities: h.amenities,
      ownerId: userIdMap[h.ownerId], // map ownerId
      status: h.status,
      views: h.views || 0,
      shortlists: h.shortlists || 0,
      reviews: h.reviews.map(r => ({
        userId: userIdMap[r.userId],
        rating: r.rating,
        text: r.text,
      })),
      questions: h.questions.map(q => ({
        userId: userIdMap[q.userId],
        text: q.text,
        answer: q.answer || null,
      })),
    }));

    await Hostel.insertMany(hostelsToInsert);

    console.log("Seeding completed!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

// Run
connectDB().then(seedData);
