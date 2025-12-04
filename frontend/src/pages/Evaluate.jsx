import { useState } from "react";
import axios from "axios";

export default function Evaluate(){
  const [rfpId, setRfpId] = useState("");
  const [results, setResults] = useState(null);

  const run = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/vendor/evaluate", { rfpId });
      setResults(res.data);
    } catch (err) {
      setResults({ error: err.response?.data?.error || err.message });
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Evaluate RFP</h2>
      <input value={rfpId} onChange={e=>setRfpId(e.target.value)} className="w-full p-2 border rounded mb-3" placeholder="RFP ID" />
      <button onClick={run} className="bg-purple-600 text-white px-4 py-2 rounded">Run</button>

      {results && (
        <div className="mt-4">
          {results.ranking?.length ? results.ranking.map((r,i)=>(
            <div key={i} className="border p-3 rounded mt-2">
              <p><strong>Vendor:</strong> {r.response.vendor_name}</p>
              <p><strong>Score:</strong> {r.score}</p>
              <pre className="text-xs mt-2">{JSON.stringify(r.response.items, null, 2)}</pre>
            </div>
          )) : <p className="mt-3">{results.error || 'No results'}</p>}
        </div>
      )}
    </div>
  );
}
