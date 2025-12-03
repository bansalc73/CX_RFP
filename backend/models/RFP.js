import mongoose from "mongoose";

const LineItemSchema = new mongoose.Schema({
  item_id: { type: String },
  name: { type: String },
  required_qty: { type: Number },
  quality_spec: { type: String },
  notes: { type: String }
});

const RFPSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  created_by: { type: String, default: "procurement@company.local" },
  created_at: { type: Date, default: Date.now },
  parameters: { type: Object, default: { priority_order: ["quality","quantity","lead_time","price"] } },
  line_items: [LineItemSchema],
  notes: String
});

export default mongoose.model("RFP", RFPSchema);
