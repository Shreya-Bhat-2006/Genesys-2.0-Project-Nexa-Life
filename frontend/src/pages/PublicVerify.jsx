import { useState } from "react";
import { verifyCredit } from "../api";

function PublicVerify() {
  const [creditId, setCreditId] = useState("");
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!creditId.trim()) {
      alert("Please enter a credit ID");
      return;
    }

    setLoading(true);
    setError(null);
    setCredit(null);

    try {
      const res = await verifyCredit(creditId);
      setCredit(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Credit not found");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Used":
        return "#f44336"; // Red
      case "Available":
        return "#4CAF50"; // Green
      case "Sold":
        return "#2196F3"; // Blue
      case "Pending Approval":
        return "#FFA500"; // Orange
      default:
        return "#666";
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "Used":
        return "#f44336";
      case "Purchased":
        return "#2196F3";
      case "Listed":
        return "#FF9800";
      case "Approved":
        return "#4CAF50";
      case "Rejected":
        return "#f44336";
      default:
        return "#666";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#BDDDDC",
        padding: "60px 20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#384959", marginBottom: "40px", textAlign: "center" }}>
          🔍 Public Credit Verification
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
            fontSize: "16px",
          }}
        >
          Enter any credit ID to verify its status and transaction history.
          <br />
          <strong>No login required!</strong>
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleVerify}
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={creditId}
              onChange={(e) => setCreditId(e.target.value)}
              placeholder="e.g., CREDIT-1-1-ABC12345"
              style={{
                flex: 1,
                padding: "12px",
                border: "2px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? "#ccc" : "#4CAF50",
                color: "white",
                padding: "12px 30px",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#FFEBEE",
              color: "#c62828",
              padding: "15px",
              borderRadius: "4px",
              marginBottom: "30px",
              border: "2px solid #ef5350",
            }}
          >
            <p style={{ margin: 0 }}>❌ {error}</p>
          </div>
        )}

        {/* Credit Details */}
        {credit && (
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "4px",
                marginBottom: "20px",
                borderLeft: `5px solid ${getStatusColor(credit.status)}`,
              }}
            >
              <h2 style={{ color: "#384959", margin: "0 0 15px 0" }}>
                {credit.credit_id}
              </h2>
              <p style={{ margin: "5px 0", color: "#666" }}>
                <strong>Current Status:</strong>{" "}
                <span style={{ color: getStatusColor(credit.status), fontWeight: "bold", fontSize: "18px" }}>
                  {credit.status}
                </span>
              </p>
              <p style={{ margin: "5px 0", color: "#666" }}>
                <strong>Current Owner:</strong> {credit.owner}
              </p>
              <p style={{ margin: "5px 0", color: "#999", fontSize: "12px" }}>
                Created: {new Date(credit.created_at).toLocaleDateString()} at{" "}
                {new Date(credit.created_at).toLocaleTimeString()}
              </p>
            </div>

            {/* History/Ledger */}
            <div>
              <h3 style={{ color: "#384959", marginBottom: "15px" }}>
                📋 Transaction History
              </h3>

              {credit.history && credit.history.length > 0 ? (
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  {credit.history.map((record, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "15px",
                        borderBottom: index < credit.history.length - 1 ? "1px solid #eee" : "none",
                        backgroundColor: index % 2 === 0 ? "#fff" : "#f5f5f5",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              margin: "0 0 5px 0",
                              fontWeight: "bold",
                              color: getActionColor(record.action),
                              fontSize: "16px",
                            }}
                          >
                            {record.action}
                          </p>
                          {record.from_owner && (
                            <p style={{ margin: "2px 0", color: "#666", fontSize: "12px" }}>
                              From: <strong>{record.from_owner}</strong>
                            </p>
                          )}
                          {record.to_owner && (
                            <p style={{ margin: "2px 0", color: "#666", fontSize: "12px" }}>
                              To: <strong>{record.to_owner}</strong>
                            </p>
                          )}
                          {record.details && (
                            <p style={{ margin: "2px 0", color: "#999", fontSize: "12px" }}>
                              {record.details}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                            {new Date(record.timestamp).toLocaleDateString()}
                          </p>
                          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#ccc" }}>
                            {new Date(record.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#999" }}>No history records found.</p>
              )}
            </div>

            {/* Locked Forever Message (if Used) */}
            {credit.status === "Used" && (
              <div
                style={{
                  backgroundColor: "#FFCDD2",
                  border: "2px solid #f44336",
                  padding: "15px",
                  borderRadius: "4px",
                  marginTop: "20px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, color: "#c62828", fontWeight: "bold" }}>
                  🔒 This credit has been USED and is locked forever.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicVerify;
