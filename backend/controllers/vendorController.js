import VendorResponse from "../models/VendorResponse.js";
import Vendor from "../models/Vendor.js";
import RFP from "../models/RFP.js";
import { scoreVendor } from "../services/aiService.js";

/* Submit vendor response */
export const submitVendorResponse = async (req, res) => {
  try {
    const payload = req.body;
    // optionally create vendor if vendor info provided and vendor_id not present
    if (payload.vendor && !payload.vendor_id) {
      const v = await Vendor.create({ name: payload.vendor.name, email: payload.vendor.email, phone: payload.vendor.phone });
      payload.vendor_id = v._id;
      payload.vendor_name = v.name;
    }

    const resp = await VendorResponse.create({
      rfp_id: payload.rfp_id,
      vendor_id: payload.vendor_id || null,
      vendor_name: payload.vendor_name || (payload.vendor && payload.vendor.name) || "unknown",
      items: payload.items || [],
      overall_notes: payload.overall_notes || "",
      raw_text: payload.raw_text || ""
    });

    res.status(201).json({ success: true, responseId: resp._id, resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* Evaluate all vendor responses for an RFP */
export const evaluateRFP = async (req, res) => {
  try {
    const { rfpId } = req.body;
    if (!rfpId) return res.status(400).json({ error: "rfpId required" });

    const rfp = await RFP.findById(rfpId).lean();
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    const responses = await VendorResponse.find({ rfp_id: rfpId }).lean();

    const scored = await Promise.all(responses.map(async r => {
      const score = await scoreVendor(rfp, r);
      return { response: r, score };
    }));

    scored.sort((a,b)=>b.score-a.score);

    return res.json({ success: true, ranking: scored });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
