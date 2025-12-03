import VendorResponse from "../models/VendorResponse.js";
import RFP from "../models/RFP.js";
import { scoreVendorUsingAI } from "../services/aiService.js";

export const submitVendorResponse = async (req, res) => {
  try {
    const response = await VendorResponse.create(req.body);
    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//
// AI-BASED EVALUATION
//
export const evaluateAI = async (req, res) => {
  try {
    const { rfpId } = req.body;

    const rfp = await RFP.findById(rfpId);
    const vendorResponses = await VendorResponse.find({ rfpId });

    const rankedVendors = [];

    for (const v of vendorResponses) {
      const score = await scoreVendorUsingAI(rfp, v);
      rankedVendors.push({
        vendor: v.vendorName,
        score,
        details: v
      });
    }

    rankedVendors.sort((a, b) => b.score - a.score);

    res.json({
      recommendedVendor: rankedVendors[0],
      ranking: rankedVendors
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
