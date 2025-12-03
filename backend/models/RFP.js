import mongoose from "mongoose";

const RFPSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    quantity: Number,
    qualitySpec: String,
    leadTimeDays: Number,
    maxPrice: Number
  },
  { timestamps: true }
);

export default mongoose.model("RFP", RFPSchema);
