import { useState } from "react";
import axios from "axios";

export default function CreateNLP(){
  const [text, setText] = useState(`I need to procure sugar and honey for our new product. Budget is Rs. 10 lakh total. Need delivery within 7 days. We need grade B of Sugar and Grade A of honey. Payment terms should be net 30.`);
  const [loading, setLoading] = useState(false);
  const [rfp, setRfp] = useState(null);
  const [message, setMessage] = useState("");

  const generate = async () => {
    setLoading(true); setMessage(""); setRfp(null);
    try {
      const res = await axios.post("http://localhost:5000/api/rfp/nlp-create", { text });
      setRfp(res.data.rfp);
      setMessage(`RFP created with ID: ${res.data.rfpId}`);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || err.message));
    } finally { setLoading(false); }
  };

  const sendToVendors = async () => {
    if (!rfp?._id) return alert("Create RFP first");
    const res = await axios.post(`http://localhost:5000/api/rfp/${rfp._id}/send`, { vendorIds: [] });
    alert(`Sent to ${res.data.sent} vendors (check backend logs)`);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Create RFP — NLP (Auto quantities)</h2>
      <textarea rows={5} className="w-full p-2 border rounded" value={text} onChange={e=>setText(e.target.value)} />
      <div className="flex gap-3 mt-3">
        <button onClick={generate} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading ? "Processing..." : "Generate RFP"}</button>
        {rfp && <button onClick={sendToVendors} className="bg-green-600 text-white px-4 py-2 rounded">Send to Vendors</button>}
      </div>

      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}

      {rfp && (
        <div className="mt-4 border rounded p-4 bg-gray-50">
          <h3 className="font-semibold">{rfp.title}</h3>
          <p className="text-sm text-gray-600">{rfp.description}</p>
          <p className="mt-2">Budget: {rfp.budget?.amount} {rfp.budget?.currency}</p>
          <p>Delivery (days): {rfp.delivery_days}</p>
          <p>Payment: {rfp.payment_terms}</p>

          <h4 className="mt-3 font-medium">Items</h4>
          <ul className="mt-2">
            {rfp.line_items.map((it, i)=>(
              <li key={i} className="text-sm">
                <strong>{it.name}</strong> — qty: {it.required_qty} {it.unit} — quality: {it.quality_spec || 'N/A'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
