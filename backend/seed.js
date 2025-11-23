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

    const createdUsers = await User.insertMany(hashedUsers);
    console.log("👤 Users inserted");

    // --- Map numeric IDs -> actual ObjectIds ---
    const userIdMap = {};
    createdUsers.forEach((u, index) => {
      userIdMap[index + 1] = u._id;
    });

    // --- Fix numeric userIds in hostels and make them compatible with schema ---
    const hostelsWithFixedIds = hostels.map((h) => ({
      ...h,

      // Ensure ownerId is a valid ObjectId
      ownerId: createdUsers[1]._id, // or modify based on your logic

      // Replace review userIds with actual ObjectIds
      reviews:
        h.reviews?.map((r) => ({
          ...r,
          userId: userIdMap[r.userId],
        })) || [],

      // Replace question userIds with actual ObjectIds
      questions:
        h.questions?.map((q) => ({
          ...q,
          userId: userIdMap[q.userId],
        })) || [],

      // Ensure new fields exist (if missing)
      views: h.views ?? 0,
      shortlists: h.shortlists ?? 0,
      universitiesNearby: h.universitiesNearby ?? [],
    }));

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
