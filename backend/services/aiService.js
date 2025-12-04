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

export const llmScoreVendor = async (rfp, vendor) => {
  const prompt = `
You are a senior FMCG procurement expert.
Evaluate this vendor's proposal strictly against this RFP.

--- RFP ---
${JSON.stringify(rfp, null, 2)}

--- Vendor Proposal ---
${JSON.stringify(vendor, null, 2)}

Use this score rubric:
- Quality match to required grade: 40%
- Quantity fulfillment: 25%
- Delivery time match: 20%
- Pricing competitiveness: 10%
- Payment terms alignment: 5%

Consider trade-offs as a human specialist would.
Example: If quality is premium → higher cost can still be accepted.

Return ONLY valid JSON:

{
  "score": <0-100>,
  "reasons": [
    "specific reason 1",
    "specific reason 2"
  ]
}
`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // update if you use gpt-4o
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1 // favor consistency
  });

  const content = completion.choices?.[0]?.message?.content?.trim();

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}") + 1;
  const jsonText = content.slice(start, end);

  return JSON.parse(jsonText);
};
