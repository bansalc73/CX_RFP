import { useState } from "react";
import axios from "axios";

export default function NLPCreate(){
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const createFromNLP = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/rfp/nlp-create", { text });
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Create RFP (NLP)</h2>

      <textarea value={text} onChange={e=>setText(e.target.value)} rows={6} className="w-full p-2 border rounded" placeholder="Write procurement requirements in natural language..."></textarea>

      <div className="flex gap-2 mt-3">
        <button onClick={createFromNLP} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading ? "Processing..." : "Generate RFP"}</button>
      </div>

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
