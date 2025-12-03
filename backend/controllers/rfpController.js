import RFP from "../models/RFP.js";

export const createRFP = async (req, res) => {
  try {
    const rfp = await RFP.create(req.body);
    res.json({ success: true, rfp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRFPs = async (req, res) => {
  try {
    const rfps = await RFP.find();
    res.json(rfps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
