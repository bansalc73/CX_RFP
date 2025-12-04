import { useState } from "react";
import axios from "axios";

export default function CreateForm(){
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [delivery, setDelivery] = useState(7);
  const [payment, setPayment] = useState("net 30");
  const [items, setItems] = useState([{ name: "sugar", required_qty: 1000, unit: "kg", quality_spec: "B" }]);
  const [msg, setMsg] = useState("");

  const addItem = ()=> setItems([...items, { name:"", required_qty:0, unit:"kg", quality_spec:"" }]);
  const update = (i,k,v)=> { const s=[...items]; s[i][k]=v; setItems(s); };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      title, description,
      budget: { amount: Number(budget), currency: "INR" },
      delivery_days: Number(delivery),
      payment_terms: payment,
      line_items: items
    };
    try {
      const res = await axios.post("http://localhost:5000/api/rfp/create", payload);
      setMsg(`RFP created: ${res.data.rfpId}`);
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Create RFP — Form</h2>
      <form onSubmit={submit} className="space-y-3">
        <input placeholder="Title" className="w-full p-2 border rounded" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea placeholder="Description" className="w-full p-2 border rounded" value={description} onChange={e=>setDescription(e.target.value)} />
        <div className="grid grid-cols-3 gap-2">
          <input placeholder="Budget amount" className="p-2 border rounded" value={budget} onChange={e=>setBudget(e.target.value)} />
          <input placeholder="Delivery days" className="p-2 border rounded" value={delivery} onChange={e=>setDelivery(e.target.value)} />
          <input placeholder="Payment terms" className="p-2 border rounded" value={payment} onChange={e=>setPayment(e.target.value)} />
        </div>

        <div>
          <h4 className="font-medium">Line items</h4>
          {items.map((it,i)=>(
            <div key={i} className="grid grid-cols-4 gap-2 mt-2">
              <input value={it.name} onChange={e=>update(i,'name',e.target.value)} className="p-2 border rounded" />
              <input value={it.required_qty} onChange={e=>update(i,'required_qty',e.target.value)} className="p-2 border rounded" />
              <input value={it.unit} onChange={e=>update(i,'unit',e.target.value)} className="p-2 border rounded" />
              <input value={it.quality_spec} onChange={e=>update(i,'quality_spec',e.target.value)} className="p-2 border rounded" />
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-sm text-blue-600 mt-2">+ add item</button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create RFP</button>
      </form>
      {msg && <p className="mt-3 text-sm text-green-700">{msg}</p>}
    </div>
  );
}
