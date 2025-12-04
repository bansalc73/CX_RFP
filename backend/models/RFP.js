import mongoose from "mongoose";

const LineItemSchema = new mongoose.Schema({
  item_id: String,
  name: String,
  required_qty: Number,
  unit: { type: String, default: "kg" },
  quality_spec: String,
  notes: String
});

const RFPSchema = new mongoose.Schema({
  title: String,
  description: String,
  created_by: { type: String, default: "procurement@company.local" },
  created_at: { type: Date, default: Date.now },
  budget: { amount: Number, currency: { type: String, default: "INR" } },
  delivery_days: Number,
  payment_terms: String,
  line_items: [LineItemSchema],
  notes: String
});

export default mongoose.model("RFP", RFPSchema);
