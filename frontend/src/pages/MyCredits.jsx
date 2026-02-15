import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCredits, useCreditEndpoint } from "../api";

function MyCredits() {
  const navigate = useNavigate();
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchMyCredits();
  }, []);

  const fetchMyCredits = async () => {
    try {
      setLoading(true);
      const res = await getMyCredits();
      setCredits(res.data);
    } catch (error) {
      console.error("Error fetching credits:", error);
      alert("❌ Error fetching credits");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCredit = async (creditId) => {
    if (
      !window.confirm(
        "⚠️ Using a credit LOCKS it forever. Are you sure?"
      )
    ) {
      return;
    }

    setActionLoading(creditId);
    try {
      await useCreditEndpoint(creditId);
      alert("✅ Credit used and locked forever!");
      fetchMyCredits();
    } catch (error) {
      alert("❌ Error: " + (error.response?.data?.detail || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Used":
        return "#f44336";
      case "Available":
        return "#4CAF50";
      case "Sold":
        return "#2196F3";
      case "Pending Approval":
        return "#FFA500";
      default:
        return "#666";
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "60px 20px" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#BDDDDC",
        padding: "60px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ color: "#384959", marginBottom: "40px", textAlign: "center" }}>
          💚 My Carbon Credits
        </h1>

        {credits.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "18px", color: "#666" }}>
              No credits yet. Apply as a green project to get started! 🌱
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {credits.map((credit) => (
              <div
                key={credit.id}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: `2px solid ${getStatusColor(credit.status)}`,
                }}
              >
                <h3 style={{ color: "#384959", marginBottom: "10px" }}>
                  {credit.credit_id}
                </h3>

                <p style={{ margin: "10px 0" }}>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: getStatusColor(credit.status),
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {credit.status}
                  </span>
                </p>

                {credit.price && (
                  <p style={{ margin: "10px 0" }}>
                    <strong>Price:</strong> ${credit.price}
                  </p>
                )}

                <p style={{ margin: "10px 0", fontSize: "12px", color: "#999" }}>
                  Created: {new Date(credit.created_at).toLocaleDateString()}
                </p>

                {credit.status === "Available" && (
                  <button
                    onClick={() => handleUseCredit(credit.credit_id)}
                    disabled={actionLoading === credit.credit_id}
                    style={{
                      width: "100%",
                      backgroundColor:
                        actionLoading === credit.credit_id ? "#ccc" : "#f44336",
                      color: "white",
                      padding: "10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor:
                        actionLoading === credit.credit_id
                          ? "not-allowed"
                          : "pointer",
                      marginTop: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {actionLoading === credit.credit_id ? "Processing..." : "🔒 Use Credit"}
                  </button>
                )}

                {credit.status === "Used" && (
                  <div
                    style={{
                      backgroundColor: "#ffebee",
                      padding: "10px",
                      borderRadius: "4px",
                      marginTop: "15px",
                      textAlign: "center",
                      color: "#c62828",
                      fontWeight: "bold",
                    }}
                  >
                    🔒 LOCKED FOREVER
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "40px",
            backgroundColor: "#384959",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "block",
            margin: "40px auto 0",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default MyCredits;
