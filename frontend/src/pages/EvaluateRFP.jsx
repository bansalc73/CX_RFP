import { useState } from "react";
import axios from "axios";

export default function EvaluateRFP() {
  const [rfpId, setRfpId] = useState("");
  const [results, setResults] = useState(null);

  const evaluate = async () => {
    const res = await axios.post("http://localhost:5000/api/vendor/evaluate", {
      rfpId,
    });
    setResults(res.data);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Evaluation</h2>

      <input
        placeholder="Enter RFP ID"
        value={rfpId}
        onChange={e => setRfpId(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button onClick={evaluate} className="bg-purple-600 text-white px-4 py-2 rounded">
        Evaluate
      </button>

      {results && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg">Recommended Vendor:</h3>
          <p>{results.recommendedVendor.vendor}</p>

          <h3 className="font-bold mt-4">Ranking:</h3>
          {results.ranking.map((v, i) => (
            <div key={i} className="border p-2 mt-2 rounded">
              <p>Vendor: {v.vendor}</p>
              <p>Score: {v.score}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
