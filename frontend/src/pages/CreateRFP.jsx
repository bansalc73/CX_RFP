import { useState } from "react";
import axios from "axios";

export default function CreateRFP(){
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([{ name: "", required_qty: "", quality_spec: "" }]);
  const [message, setMessage] = useState("");

  const addItem = () => setItems([...items, { name: "", required_qty: "", quality_spec: "" }]);
  const updateItem = (idx, key, value) => {
    const ns = [...items]; ns[idx][key] = value; setItems(ns);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, line_items: items };
      const resp = await axios.post("http://localhost:5000/api/rfp/create", payload);
      setMessage(`Created RFP ${resp.data.rfpId}`);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Create RFP (Form)</h2>

      <form onSubmit={submit} className="space-y-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="RFP Title" className="w-full p-2 border rounded" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />

        <div>
          <h3 className="font-medium">Line items</h3>
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 mt-2">
              <input value={it.name} onChange={e=>updateItem(idx,'name',e.target.value)} placeholder="Item name (wheat/sugar)" className="p-2 border rounded"/>
              <input value={it.required_qty} onChange={e=>updateItem(idx,'required_qty',e.target.value)} placeholder="Quantity (e.g., 200)" className="p-2 border rounded"/>
              <input value={it.quality_spec} onChange={e=>updateItem(idx,'quality_spec',e.target.value)} placeholder="Quality spec (Grade A or %) " className="p-2 border rounded"/>
            </div>
          ))}
          <button type="button" onClick={addItem} className="mt-3 text-sm text-blue-600">+ Add item</button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create RFP</button>
      </form>

      {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
    </div>
  );
}
