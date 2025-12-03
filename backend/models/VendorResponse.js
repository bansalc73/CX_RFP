import mongoose from "mongoose";

const ResponseItemSchema = new mongoose.Schema({
  rfp_item_id: String,
  vendor_desc: String,
  qty_offered: Number,
  quality: String,
  lead_time_days: Number,
  unit_price: Number,
  total_price: Number
});

const VendorResponseSchema = new mongoose.Schema({
  rfp_id: { type: mongoose.Schema.Types.ObjectId, ref: "RFP" },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", default: null },
  vendor_name: String,
  submitted_at: { type: Date, default: Date.now },
  currency: { type: String, default: "INR" },
  items: [ResponseItemSchema],
  overall_notes: String,
  confidence: { type: Object, default: {} },
  raw_text: String
});

export default mongoose.model("VendorResponse", VendorResponseSchema);
