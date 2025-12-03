import { useState, useEffect } from "react";
import axios from "axios";

export default function VendorSubmit(){
  const [rfpId, setRfpId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [items, setItems] = useState([{ vendor_desc:"", qty_offered:"", quality:"", lead_time_days:"", unit_price:"" }]);
  const [message, setMessage] = useState("");

  const addItem = () => setItems([...items, { vendor_desc:"", qty_offered:"", quality:"", lead_time_days:"", unit_price:"" }]);
  const updateItem = (idx, key, value) => { const s=[...items]; s[idx][key]=value; setItems(s); };

  const submit = async () => {
    try {
      const payload = { rfp_id: rfpId, vendor_name: vendorName, items };
      await axios.post("http://localhost:5000/api/vendor/submit", payload);
      setMessage("Submitted vendor response");
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Submit Vendor Response</h2>

      <input value={rfpId} onChange={e=>setRfpId(e.target.value)} placeholder="RFP ID" className="w-full p-2 border rounded mb-2"/>
      <input value={vendorName} onChange={e=>setVendorName(e.target.value)} placeholder="Vendor Name" className="w-full p-2 border rounded mb-4"/>

      <div>
        <h4 className="mb-2">Quoted Items</h4>
        {items.map((it, idx)=>(
          <div className="grid grid-cols-5 gap-2 mb-2" key={idx}>
            <input value={it.vendor_desc} onChange={e=>updateItem(idx,'vendor_desc',e.target.value)} placeholder="desc" className="p-2 border rounded" />
            <input value={it.qty_offered} onChange={e=>updateItem(idx,'qty_offered',e.target.value)} placeholder="qty" className="p-2 border rounded" />
            <input value={it.quality} onChange={e=>updateItem(idx,'quality',e.target.value)} placeholder="quality" className="p-2 border rounded" />
            <input value={it.lead_time_days} onChange={e=>updateItem(idx,'lead_time_days',e.target.value)} placeholder="lead days" className="p-2 border rounded" />
            <input value={it.unit_price} onChange={e=>updateItem(idx,'unit_price',e.target.value)} placeholder="unit price" className="p-2 border rounded" />
          </div>
        ))}
        <button onClick={addItem} className="text-blue-600 text-sm">+ add item</button>
      </div>

      <div className="mt-4">
        <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </div>

      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
    </div>
  );
}
