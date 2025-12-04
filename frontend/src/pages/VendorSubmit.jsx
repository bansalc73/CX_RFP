import { useState } from "react";
import axios from "axios";

export default function VendorSubmit(){
  const [rfpId, setRfpId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [items, setItems] = useState([{ vendor_desc:"Sugar Grade B", qty_offered:1000, quality:"Grade B", lead_time_days:5, unit_price:25 }]);
  const [msg, setMsg] = useState("");

  const addItem = ()=> setItems([...items, { vendor_desc:"", qty_offered:0, quality:"", lead_time_days:0, unit_price:0 }]);
  const update = (i,k,v)=>{ const s=[...items]; s[i][k]=v; setItems(s); };

  const submit = async () => {
    try {
      const payload = { rfp_id: rfpId, vendor_name: vendorName, items };
      await axios.post("http://localhost:5000/api/vendor/submit", payload);
      setMsg("Submitted");
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Submit Vendor Response</h2>
      <input placeholder="RFP ID" className="w-full p-2 border rounded mb-2" value={rfpId} onChange={e=>setRfpId(e.target.value)} />
      <input placeholder="Vendor Name" className="w-full p-2 border rounded mb-2" value={vendorName} onChange={e=>setVendorName(e.target.value)} />

      <div>
        {items.map((it,i)=>(
          <div key={i} className="grid grid-cols-5 gap-2 mb-2">
            <input value={it.vendor_desc} onChange={e=>update(i,'vendor_desc',e.target.value)} className="p-2 border rounded" />
            <input value={it.qty_offered} onChange={e=>update(i,'qty_offered',e.target.value)} className="p-2 border rounded" />
            <input value={it.quality} onChange={e=>update(i,'quality',e.target.value)} className="p-2 border rounded" />
            <input value={it.lead_time_days} onChange={e=>update(i,'lead_time_days',e.target.value)} className="p-2 border rounded" />
            <input value={it.unit_price} onChange={e=>update(i,'unit_price',e.target.value)} className="p-2 border rounded" />
          </div>
        ))}
        <button onClick={addItem} className="text-sm text-blue-600">+ add item</button>
      </div>

      <div className="mt-3">
        <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </div>
      {msg && <p className="mt-3 text-sm text-green-700">{msg}</p>}
    </div>
  );
}
