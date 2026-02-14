import { useState } from "react";

function PublicVerify() {
  const [creditId, setCreditId] = useState("");
  const [result, setResult] = useState(null);

  const handleVerify = () => {
    setResult({
      id: creditId,
      owner: "Company A",
      status: "Active"
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Public Verification</h2>

      <input
        type="text"
        placeholder="Enter Credit ID"
        value={creditId}
        onChange={(e) => setCreditId(e.target.value)}
      />

      <button onClick={handleVerify} style={{ marginLeft: "10px" }}>
        Verify
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Credit ID:</strong> {result.id}</p>
          <p><strong>Owner:</strong> {result.owner}</p>
          <p><strong>Status:</strong> {result.status}</p>
        </div>
      )}
    </div>
  );
}

export default PublicVerify;
