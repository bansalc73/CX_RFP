import RFP from "../models/RFP.js";
import Vendor from "../models/Vendor.js";
import { generateRFPFromText, composeVendorEmail } from "../services/aiService.js";

/* Manual create */
export const createRFP = async (req, res) => {
  try {
    const rfp = await RFP.create(req.body);
    return res.status(201).json({ success: true, rfpId: rfp._id, rfp });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* NLP create - auto fill quantities if missing using defaults */
export const createRFPFromNLP = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    const extracted = await generateRFPFromText(text);

    // Ensure line_items array and auto-fill defaults for missing quantities
    const defaults = { sugar: 1000, honey: 100, default_unit: "kg" }; // sugar: 1000kg, honey:100kg
    const items = (extracted.line_items || []).map((it, idx) => {
      const name = (it.name || it.item || "").toLowerCase();
      const qty = it.required_qty || (name.includes("sugar") ? defaults.sugar : name.includes("honey") ? defaults.honey : 100);
      return {
        item_id: it.item_id || `item-${idx+1}`,
        name: it.name || it.item || "unknown",
        required_qty: qty,
        unit: it.unit || defaults.default_unit,
        quality_spec: it.quality_spec || it.grade || null,
        notes: it.notes || ""
      };
    });

    const rfpDoc = {
      title: extracted.title || "RFP - NL Generated",
      description: extracted.description || text,
      budget: extracted.budget || { amount: extracted.budget_amount || null, currency: extracted.budget_currency || "INR" },
      delivery_days: extracted.delivery_days || extracted.delivery || null,
      payment_terms: extracted.payment_terms || extracted.payment || null,
      line_items: items,
      notes: extracted.notes || ""
    };

    const rfp = await RFP.create(rfpDoc);
    return res.status(201).json({ success: true, rfpId: rfp._id, rfp });
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

/* Dummy send - composes email (string) and 'sends' to vendors by logging */
export const sendRFPToVendors = async (req, res) => {
  try {
    const rfpId = req.params.id;
    const { vendorIds } = req.body; // optional list; if empty send to all
    const rfp = await RFP.findById(rfpId).lean();
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    let vendors;
    if (vendorIds && vendorIds.length) vendors = await Vendor.find({ _id: { $in: vendorIds } }).lean();
    else vendors = await Vendor.find().lean();

    const emails = vendors.map(v => {
      const emailText = composeVendorEmail(rfp, v);
      // Dummy send — in production, call email API here.
      console.log("=== Sending email to:", v.email);
      console.log(emailText);
      return { to: v.email, body: emailText };
    });

    return res.json({ success: true, sent: emails.length, details: emails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};