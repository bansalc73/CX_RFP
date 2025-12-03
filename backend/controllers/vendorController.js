import VendorResponse from "../models/VendorResponse.js";
import Vendor from "../models/vendor.js";
import RFP from "../models/RFP.js";
import { scoreVendor } from "../services/aiService.js";

/**
 * Submit vendor response (body contains vendor_name, rfp_id, raw_text or items)
 */
export const submitVendorResponse = async (req, res) => {
  try {
    const payload = req.body;

    // If vendor included vendor_id, optionally ensure vendor exists
    if (payload.vendor_id && !payload.vendor_name) {
      const v = await Vendor.findById(payload.vendor_id);
      if (v) payload.vendor_name = v.name;
    }

    const resp = await VendorResponse.create(payload);
    res.status(201).json({ success: true, responseId: resp._id, response: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Evaluate & rank vendor responses for a given rfpId
 * body: { rfpId: "<id>" }
 */
export const evaluateRFP = async (req, res) => {
  try {
    const { rfpId } = req.body;
    if (!rfpId) return res.status(400).json({ error: "rfpId required" });

    const rfp = await RFP.findById(rfpId).lean();
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    const responses = await VendorResponse.find({ rfp_id: rfpId }).populate('vendor_id').lean();

    // score each using our scoring function
    const scored = await Promise.all(
      responses.map(async (r) => {
        const s = await scoreVendor(rfp, r);
        return { response: r, score: s };
      })
    );

    // Sort descending
    scored.sort((a,b) => b.score - a.score);

    res.json({ success: true, ranking: scored });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
