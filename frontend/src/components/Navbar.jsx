import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex gap-6">
      <Link to="/" className="font-semibold">Create RFP</Link>
      <Link to="/submit" className="font-semibold">Vendor Submit</Link>
      <Link to="/evaluate" className="font-semibold">Evaluate RFP</Link>
    </div>
  );
}
