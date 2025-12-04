import { useState } from "react";
import axios from "axios";

export default function Evaluate() {
  const [rfpId, setRfpId] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/vendor/evaluate", { rfpId });
      setResults(res.data);
    } catch (err) {
      setResults({ error: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">AI Vendor Evaluation</h2>
      <input
        value={rfpId}
        onChange={(e) => setRfpId(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        placeholder="RFP ID"
      />
      <button
        onClick={run}
        disabled={!rfpId || loading}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Evaluating..." : "Evaluate"}
      </button>

      {results?.ranking && (
        <div className="mt-4 space-y-3">
          {results.ranking.length === 0 && <p>No responses yet.</p>}
          {results.ranking.map((r, i) => (
            <div key={i} className="border p-4 rounded bg-gray-50">
              <div className="flex justify-between">
                <h3 className="font-semibold">{r.vendorName}</h3>
                <span className="text-sm font-bold text-purple-700">Score: {r.score}</span>
              </div>
              <p className="text-xs mt-2 font-medium">AI Justification:</p>
              <ul className="text-xs list-disc ml-4 text-gray-700">
                {r.reasons.map((reason, j) => (
                  <li key={j}>{reason}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {results?.error && (
        <p className="mt-3 text-red-600 text-sm">{results.error}</p>
      )}
    </div>
  );
}
