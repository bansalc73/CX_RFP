import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreateNLP from "./pages/CreateNLP";
import CreateForm from "./pages/CreateForm";
import RFPList from "./pages/RFPList";
import VendorSubmit from "./pages/VendorSubmit";
import Evaluate from "./pages/Evaluate";
import "./styles/styles.css";

function App(){
  return (
    <BrowserRouter>
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="font-bold">AI RFP — FMCG</h1>
          <nav className="flex gap-4">
            <Link to="/" className="text-sm">NLP Create</Link>
            <Link to="/form" className="text-sm">Form Create</Link>
            <Link to="/rfps" className="text-sm">RFPs</Link>
            <Link to="/vendor" className="text-sm">Vendor Submit</Link>
            <Link to="/evaluate" className="text-sm">Evaluate</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<CreateNLP />} />
          <Route path="/form" element={<CreateForm />} />
          <Route path="/rfps" element={<RFPList />} />
          <Route path="/vendor" element={<VendorSubmit />} />
          <Route path="/evaluate" element={<Evaluate />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
