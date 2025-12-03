import axios from "axios";

export const scoreVendorUsingAI = async (rfp, vendor) => {
  //
  // ⭐ SIMPLE AI SIMULATION (Replace with real LLM API)
  //
  // Score out of 100 based on:
  // Quality → 40%
  // Quantity → 25%
  // Lead time → 20%
  // Price → 15%
  //

  let score = 0;

  // Quality matching (LLM can do semantic comparison)
  if (vendor.qualityDescription.toLowerCase().includes(rfp.qualitySpec.toLowerCase()))
    score += 40;
  else score += 20;

  // Quantity
  score += (vendor.offeredQuantity / rfp.quantity) * 25;

  // Lead time (lower = better)
  if (vendor.leadTimeDays <= rfp.leadTimeDays) score += 20;
  else score += 10;

  // Price (lower = better)
  if (vendor.quotedPrice <= rfp.maxPrice) score += 15;
  else score += 5;

  return Math.round(score);
};
