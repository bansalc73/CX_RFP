import mongoose from "mongoose";

const VendorResponseSchema = new mongoose.Schema(
  {
    rfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFP"
    },
    vendorName: String,
    quotedPrice: Number,
    offeredQuantity: Number,
    qualityDescription: String,
    leadTimeDays: Number,
    pdfUrl: String // placeholder field
  },
  { timestamps: true }
);

export default mongoose.model("VendorResponse", VendorResponseSchema);
