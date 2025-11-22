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

    // --- Build a map 1,2,3 => ObjectId ---
    const userIdMap = {};
    createdUsers.forEach((u, index) => {
      userIdMap[index + 1] = u._id;
    });

    // --- Fix numeric userIds in hostels ---
    const hostelsWithFixedIds = hostels.map((h) => ({
      ...h,
      ownerId: createdUsers[1]._id,

      reviews: h.reviews?.map((r) => ({
        ...r,
        userId: userIdMap[r.userId],
      })) || [],

      questions: h.questions?.map((q) => ({
        ...q,
        userId: userIdMap[q.userId],
      })) || [],
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
