import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* Compose simple vendor email (string) */
export const composeVendorEmail = (rfp, vendor) => {
  const lines = [];
  lines.push(`Hello ${vendor.name},`);
  lines.push("");
  lines.push(`We are seeking quotations for the following RFP: ${rfp.title || "Procurement Request"}`);
  lines.push(`Description: ${rfp.description || ""}`);
  lines.push("");
  lines.push("Items:");
  (rfp.line_items || []).forEach(it => {
    lines.push(`- ${it.name}: qty ${it.required_qty} ${it.unit || 'kg'}, quality: ${it.quality_spec || ''}`);
  });
  lines.push("");
  lines.push(`Budget: ${rfp.budget?.amount || ""} ${rfp.budget?.currency || "INR"}`);
  lines.push(`Delivery within ${rfp.delivery_days || ""} days`);
  lines.push(`Payment terms: ${rfp.payment_terms || ""}`);
  lines.push("");
  lines.push("Please reply with your quotation (PDF or text) and include unit prices, lead times, and quality certificates.");
  lines.push("");
  lines.push("Regards, Procurement Team");

  return lines.join("\n");
};

/* NLP: extract RFP JSON from free text */
export const generateRFPFromText = async (text) => {
  // Prompt instructing model to return JSON schema
  const prompt = `
You are an extractor for procurement RFPs for raw materials.
Given the following user request, extract JSON with these fields:

{
 "title": string,
 "description": string,
 "line_items": [
   { "item_id": string, "name": string, "required_qty": number (optional), "unit": string (optional), "quality_spec": string (optional) }
 ],
 "budget_amount": number (optional),
 "budget_currency": string (optional),
 "delivery_days": number (optional),
 "payment_terms": string (optional),
 "notes": string (optional)
}

If a numeric value is not present, you may omit it. Return ONLY valid JSON.

Input:
"""${text}"""
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // adjust to a model you have access to
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  const content = completion.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("No output from LLM");

  // parse JSON (allow JSON inside extra text)
  let parsed = null;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    const m = content.match(/(\{[\s\S]*\})/);
    if (m) parsed = JSON.parse(m[1]);
    else throw new Error("LLM did not return JSON");
  }

  // Normalize keys: map budget_* to budget object
  const out = {
    title: parsed.title || null,
    description: parsed.description || null,
    line_items: parsed.line_items || parsed.items || [],
    budget: parsed.budget_amount ? { amount: parsed.budget_amount, currency: parsed.budget_currency || "INR" } : null,
    delivery_days: parsed.delivery_days || parsed.delivery || null,
    payment_terms: parsed.payment_terms || null,
    notes: parsed.notes || null
  };

  return out;
};

/* Simple vendor scoring — quality/qty/lead/price weights */
export const scoreVendor = async (rfp, vendorResponse) => {
  // compute metrics
  let totalQty = 0, totalPrice = 0, leadSum = 0, qualityScores = 0;
  const items = vendorResponse.items || [];
  items.forEach(it => {
    const qty = Number(it.qty_offered || 0);
    const unitPrice = Number(it.unit_price || 0);
    const total = Number(it.total_price || (qty * unitPrice || 0));
    const lead = Number(it.lead_time_days || 999);
    totalQty += qty;
    totalPrice += total;
    leadSum += lead;
    const qText = (it.quality || "").toLowerCase();
    let qScore = 50;
    if (qText.includes("grade a") || qText.includes("a grade") || qText.includes("premium")) qScore = 90;
    else if (qText.includes("grade b")) qScore = 70;
    else if (qText.includes("grade c") || qText.includes("low")) qScore = 40;
    qualityScores += qScore;
  });

  const avgQuality = items.length ? qualityScores / items.length : 50;
  const avgLead = items.length ? leadSum / items.length : 999;

  // quantity target = sum of rfp required_qty
  const targetQty = (rfp.line_items || []).reduce((s,i)=>s + (Number(i.required_qty)||0), 0) || 1;
  const qtyScore = Math.min(1, totalQty / targetQty) * 30; // up to 30
  const qualityComponent = (avgQuality/100)*40; // up to 40
  const leadComponent = avgLead <= 0 ? 0 : Math.max(0, (1 - (avgLead / (rfp.delivery_days || 30))) * 20);
  let priceComponent = 0;
  if (rfp.budget?.amount && totalPrice) {
    priceComponent = totalPrice <= rfp.budget.amount ? 10 : Math.max(0, 10 * (1 - ((totalPrice - rfp.budget.amount)/rfp.budget.amount)));
  } else {
    priceComponent = Math.max(0, 10 - (totalPrice/100000)); // small heuristic
  }

  const raw = qtyScore + qualityComponent + leadComponent + priceComponent;
  const maxPossible = 30 + 40 + 20 + 10;
  const score = Math.round((raw / maxPossible) * 100);
  return score;
};
