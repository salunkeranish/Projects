import { useState } from "react";
import axios from "axios";
import "./App.css";
const states = [
  "Assam",
  "Mizoram",
  "Meghalaya",
  "Manipur",
  "Nagaland",
  "Tripura",
  "Sikkim",
];

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!selectedState) return;

    setLoading(true);
    setError("");
    setResult(null);

    const url = `https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd0000017ddac7da3cbe42e77231fa49f795c588&format=json&filters[statename]=${selectedState}`;

    try {
      const res = await axios.get(url);
      const records = res.data.records;
      const uniquePincodes = new Set(records.map((r) => r.pincode)).size;
      const uniqueDistricts = new Set(records.map((r) => r.districtname)).size;
      setResult({ pincodes: uniquePincodes, districts: uniqueDistricts });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">North-East Pincode Explorer</h2>

      <div className="row justify-content-center mb-3">
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">-- Select a North Eastern State --</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={fetchData}
            disabled={!selectedState || loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {result && (
        <div className="card text-center mx-auto" style={{ maxWidth: "400px" }}>
          <div className="card-body">
            <h5 className="card-title">Results for {selectedState}</h5>
            <p className="card-text">
              <strong>Unique Pincodes:</strong> {result.pincodes}
            </p>
            <p className="card-text">
              <strong>Unique Districts:</strong> {result.districts}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
