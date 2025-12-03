import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Call LLM to extract an RFP JSON from free-text input
 */
export const generateRFPFromText = async (text) => {
  // Prompt instructing model to return JSON in required schema
  const prompt = `
You are an extractor. Convert the following procurement request into JSON only.

Input:
"""${text}"""

Output JSON schema:
{
  "title": "string",
  "description": "string",
  "line_items": [
    { "item_id": "string", "name": "string", "required_qty": number, "quality_spec": "string", "notes": "string" }
  ],
  "notes": "string"
}

Return ONLY valid JSON.
`;

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini", // replace with a model available to you
    messages: [{ role: "user", content: prompt }],
    max_tokens: 700,
    temperature: 0
  });

  const content = resp.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("No response from LLM");

  // try to parse JSON
  let parsed = null;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    // try to extract JSON substring
    const m = content.match(/(\{[\s\S]*\})/);
    if (m) parsed = JSON.parse(m[1]);
    else throw new Error("LLM output not JSON");
  }

  // Normalize: ensure line_items exists
  if (!parsed.line_items || !Array.isArray(parsed.line_items)) parsed.line_items = [];

  return parsed;
};

/**
 * Simple scoring function (weights can be tuned)
 * Priority: quality (0.4), quantity (0.3), lead time (0.2), price (0.1)
 *
 * vendorResponse: structure may have items[] with qty_offered, quality, lead_time_days, total_price
 */
export const scoreVendor = async (rfp, vendorResponse) => {
  // Aggregate vendor metrics
  // For simplicity assume vendorResponse.items array and rfp.line_items correspond 1:1
  let totalQty = 0, totalPrice = 0, totalLead = 0, qScores = [];
  const items = vendorResponse.items || [];

  for (const it of items) {
    const qty = Number(it.qty_offered || 0);
    const up = Number(it.unit_price || 0);
    const tp = Number(it.total_price || (qty * up || 0));
    const lead = Number(it.lead_time_days || 999);
    const qualText = (it.quality || "").toLowerCase();

    totalQty += qty;
    totalPrice += tp;
    totalLead += lead;

    // quality mapping (simple heuristics)
    let qScore = 50;
    if (qualText.includes("grade a") || qualText.includes("a grade") || qualText.includes("premium") || qualText.includes("excellent")) qScore = 90;
    else if (qualText.includes("grade b") || qualText.includes("b grade")) qScore = 70;
    else if (qualText.includes("grade c") || qualText.includes("low")) qScore = 40;
    // detect percentage quality like moisture/protein 12%
    const pctMatch = qualText.match(/(\d+(\.\d+)?)\s*%/);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      // scale pct to 0..100 (example heuristic)
      qScore = Math.min(100, pct * 8);
    }
    qScores.push(qScore);
  }

  const avgQuality = qScores.length ? (qScores.reduce((a,b)=>a+b,0)/qScores.length) : 50;
  const avgLead = items.length ? totalLead / items.length : 999;

  // For normalization we need reference min/max across candidates, but as we score single vendor here,
  // we'll compute a heuristic score combining raw metrics (not normalized against peers)
  // The evaluateRFP endpoint sorts vendors by this score; because absolute scale matters less than relative,
  // this simple aggregator works for demo.

  // value components: higher better for qty & quality; lower better for price & lead
  const qualityComponent = (avgQuality / 100) * 40; // up to 40
  // quantity component: compare to requested total (sum rfp line_items req qty)
  const rfpTotalQty = (rfp.line_items || []).reduce((s,i)=>s + (Number(i.required_qty) || 0), 0) || 1;
  const qtyRatio = Math.min(1, totalQty / rfpTotalQty);
  const quantityComponent = qtyRatio * 30; // up to 30
  // lead component
  const leadComponent = (avgLead <= 0 || avgLead > 3650) ? 0 : (Math.max(0, (1 - (avgLead / (rfp.parameters?.maxLeadDays || 90))) ) * 20);
  // price component: if vendor provides totalPrice and rfp has expected price or maxPrice
  let priceComponent = 0;
  if (rfp.parameters?.max_price && totalPrice) {
    priceComponent = (totalPrice <= rfp.parameters.max_price) ? 15 : Math.max(0, 15 * (1 - ((totalPrice - rfp.parameters.max_price) / rfp.parameters.max_price)));
  } else {
    // if no max price, reward lower absolute price modestly
    priceComponent = totalPrice ? Math.max(0, 15 - (totalPrice / 100000)) : 5;
  }

  // sum
  const rawScore = qualityComponent + quantityComponent + leadComponent + priceComponent;
  // normalize to 0-100
  const score = Math.round((rawScore / (40+30+20+15)) * 100);

  return score;
};
