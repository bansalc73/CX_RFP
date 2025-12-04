import { useEffect, useState } from "react";
import axios from "axios";

export default function RFPList(){
  const [rfps, setRfps] = useState([]);

  useEffect(()=> {
    axios.get("http://localhost:5000/api/rfp/").then(r=>setRfps(r.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">RFPs</h2>
      <div className="grid gap-4">
        {rfps.map(r => (
          <div key={r._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-sm text-gray-600">{r.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">ID: {r._id}</p>
                <p className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3">
              <p>Budget: {r.budget?.amount} {r.budget?.currency}</p>
              <p>Delivery days: {r.delivery_days}</p>
              <ul className="mt-2">
                {(r.line_items||[]).map((it,i)=>(
                  <li key={i} className="text-sm">• {it.name} — {it.required_qty}{it.unit} — grade: {it.quality_spec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
