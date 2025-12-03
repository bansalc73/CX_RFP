import RFP from "../models/RFP.js";
import { generateRFPFromText } from "../services/aiService.js";

/**
 * Create RFP directly (form JSON)
 */
export const createRFP = async (req, res) => {
  try {
    const rfp = await RFP.create(req.body);
    return res.status(201).json({ success: true, rfpId: rfp._id, rfp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Create RFP using LLM (NLP)
 * payload: { text: "We need 200 tons sugar grade A..." }
 */
export const createRFPFromNLP = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });

    const extracted = await generateRFPFromText(text);

    // massage extracted into our schema: ensure line_items array
    const rfpDoc = {
      title: extracted.title || extracted.description || "RFP - NL Generated",
      description: extracted.description || text,
      line_items: Array.isArray(extracted.line_items) && extracted.line_items.length ? extracted.line_items : (extracted.items ? extracted.items : []),
      notes: extracted.notes || ""
    };

    const rfp = await RFP.create(rfpDoc);
    return res.status(201).json({ success: true, rfpId: rfp._id || rfp._id, rfp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const listRFPs = async (req, res) => {
  const rfps = await RFP.find().sort({ created_at: -1 }).lean();
  res.json(rfps);
};

export const getRFP = async (req, res) => {
  const rfp = await RFP.findById(req.params.id).lean();
  if (!rfp) return res.status(404).json({ error: "RFP not found" });
  res.json(rfp);
};
