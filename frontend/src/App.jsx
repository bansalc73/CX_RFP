import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import CreateRFP from "./pages/CreateRFP";
import SubmitVendorResponse from "./pages/SubmitVendorResponse";
import EvaluateRFP from "./pages/EvaluateRFP";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CreateRFP />} />
        <Route path="/submit" element={<SubmitVendorResponse />} />
        <Route path="/evaluate" element={<EvaluateRFP />} />
      </Routes>
    </BrowserRouter>
  );
}
