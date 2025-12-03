import { useState } from "react";
import axios from "axios";

export default function Evaluate(){
  const [rfpId, setRfpId] = useState("");
  const [results, setResults] = useState(null);

  const runEval = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/vendor/evaluate", { rfpId });
      setResults(res.data);
    } catch (err) {
      setResults({ error: err.response?.data?.error || err.message });
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Evaluate RFP</h2>
      <input value={rfpId} onChange={e=>setRfpId(e.target.value)} placeholder="RFP ID" className="w-full p-2 border rounded mb-3" />
      <button onClick={runEval} className="bg-purple-600 text-white px-4 py-2 rounded">Run Evaluation</button>

      {results && (
        <div className="mt-4">
          <h3 className="font-semibold">Ranking</h3>
          {results.ranking?.length ? results.ranking.map((r,i)=>(
            <div key={i} className="border p-3 rounded mt-2">
              <p><strong>Vendor:</strong> {r.response.vendor_name || r.response.vendor_id}</p>
              <p><strong>Score:</strong> {r.score}</p>
              <pre className="text-xs mt-2">{JSON.stringify(r.response.items, null, 2)}</pre>
            </div>
          )) : <p className="mt-2 text-sm">{results.error || 'No results'}</p>}
        </div>
      )}
    </div>
  );
}
