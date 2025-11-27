import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    durationDays: Number,
    amount: Number,
    purchasedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Sale", salesSchema);
