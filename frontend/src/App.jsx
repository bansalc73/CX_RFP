import { Routes, Route, Link } from "react-router-dom";
import CreateRFP from "./pages/CreateRFP";
import NLPCreate from "./pages/NLPCreate";
import RFPList from "./pages/RFPList";
import VendorSubmit from "./pages/VendorSubmit";
import Evaluate from "./pages/Evaluate";

export default function App(){
  return (
    <div>
      <header className="bg-white shadow">
        <div className="container px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">AI RFP — FMCG</h1>
          <nav className="flex gap-4">
            <Link to="/" className="text-sm text-gray-700 hover:text-blue-600">Create (Form)</Link>
            <Link to="/nlp" className="text-sm text-gray-700 hover:text-blue-600">Create (NLP)</Link>
            <Link to="/rfps" className="text-sm text-gray-700 hover:text-blue-600">RFPs</Link>
            <Link to="/vendor" className="text-sm text-gray-700 hover:text-blue-600">Vendor Submit</Link>
            <Link to="/evaluate" className="text-sm text-gray-700 hover:text-blue-600">Evaluate</Link>
          </nav>
        </div>
      </header>

      <main className="container px-6 py-8">
        <Routes>
          <Route path="/" element={<CreateRFP />} />
          <Route path="/nlp" element={<NLPCreate />} />
          <Route path="/rfps" element={<RFPList />} />
          <Route path="/vendor" element={<VendorSubmit />} />
          <Route path="/evaluate" element={<Evaluate />} />
        </Routes>
      </main>
    </div>
  );
}
