import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  rating: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Vendor", VendorSchema);

