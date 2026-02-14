import { useState } from "react";
import API from "../services/api";

function PublicVerify() {
  const [id, setId] = useState("");
  const [credit, setCredit] = useState(null);

  const verify = async () => {
    try {
      const res = await API.get("/credits");
      const found = res.data.find(c => c.credit_id === id);
      setCredit(found || null);
    } catch {
      alert("Verification failed");
    }
  };

  return (
    <div className="container">
      <h2>Verify Credit</h2>

      <input
        placeholder="Enter Credit ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={verify}>Verify</button>

      {credit && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Owner:</strong> {credit.owner_email}</p>
          <p><strong>Status:</strong> {credit.status}</p>
        </div>
      )}
    </div>
  );
}

export default PublicVerify;
