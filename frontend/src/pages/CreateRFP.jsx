import { useState } from "react";
import axios from "axios";

export default function CreateRFP() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    qualitySpec: "",
    leadTimeDays: "",
    maxPrice: "",
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/rfp/create", form);
    alert("RFP Created Successfully!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create RFP</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {Object.keys(form).map(key => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
