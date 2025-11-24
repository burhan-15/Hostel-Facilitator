import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";

import User from "./models/User.js";
import Hostel from "./models/Hostel.js";

import { users } from "./data/users.js";
import { hostels } from "./data/hostelMock.js";

dotenv.config();
await connectDB();

const seedData = async () => {
  try {
    // Clear old data
    await User.deleteMany();
    await Hostel.deleteMany();
    console.log("🧹 Old data cleared");

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log("👤 Users inserted");

    // Map numeric IDs -> actual ObjectIds
    const userIdMap = {};
    createdUsers.forEach((u, index) => {
      userIdMap[index + 1] = u._id;
    });

    // Fix hostels' ownerId, reviews, and questions
    const hostelsWithFixedIds = hostels.map((h) => ({
      ...h,

      // Map numeric ownerId to actual ObjectId
      ownerId: userIdMap[h.ownerId],

      // Map review userIds
      reviews:
        h.reviews?.map((r) => ({
          ...r,
          userId: userIdMap[r.userId],
        })) || [],

      // Map question userIds
      questions:
        h.questions?.map((q) => ({
          ...q,
          userId: userIdMap[q.userId],
        })) || [],

      // FAQs (keep as is)
      faqs: h.faqs || [],

      // Ensure other fields exist
      views: h.views ?? 0,
      shortlists: h.shortlists ?? 0,
      nearbyUniversities: h.nearbyUniversities ?? h.universitiesNearby ?? [],
    }));

    // Insert hostels
    await Hostel.insertMany(hostelsWithFixedIds);
    console.log("🏠 Hostels inserted");

    console.log("🌱 Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedData();
