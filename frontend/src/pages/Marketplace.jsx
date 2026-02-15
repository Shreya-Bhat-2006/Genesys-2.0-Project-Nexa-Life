import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyCredits,
  getAvailableCredits,
  listCreditForSale,
  buyCredit,
} from "../api";

function Marketplace() {
  const navigate = useNavigate();
  const [myCredits, setMyCredits] = useState([]);
  const [availableCredits, setAvailableCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingPrice, setListingPrice] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [myRes, availRes] = await Promise.all([
        getMyCredits(),
        getAvailableCredits(),
      ]);
      setMyCredits(myRes.data);
      setAvailableCredits(availRes.data);
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleListCredit = async (creditId) => {
    const price = listingPrice[creditId];
    if (!price || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setActionLoading(creditId);
    try {
      await listCreditForSale(creditId, parseFloat(price));
      alert("✅ Credit listed for sale!");
      setListingPrice({ ...listingPrice, [creditId]: "" });
      fetchData();
    } catch (error) {
      alert("❌ Error: " + (error.response?.data?.detail || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuyCredit = async (creditId) => {
    if (!window.confirm("Buy this credit?")) return;

    setActionLoading(creditId);
    try {
      await buyCredit(creditId);
      alert("✅ Credit purchased! Ownership transferred to you.");
      fetchData();
    } catch (error) {
      alert("❌ Error: " + (error.response?.data?.detail || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#BDDDDC",
        padding: "60px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#384959", marginBottom: "40px", textAlign: "center" }}>
          🏪 Carbon Marketplace
        </h1>

        {/* My Unlisted Credits - List for Sale */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "40px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#384959", marginBottom: "20px" }}>
            💰 My Credits - List for Sale
          </h2>

          {myCredits.filter((c) => c.status !== "Used").length === 0 ? (
            <p style={{ color: "#666" }}>
              No available credits to list. Wait for admin approval first!
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {myCredits
                .filter((credit) => credit.status !== "Used" && credit.status !== "Sold")
                .map((credit) => (
                  <div
                    key={credit.id}
                    style={{
                      border: "2px solid #4CAF50",
                      padding: "15px",
                      borderRadius: "8px",
                      backgroundColor: "#f1f8f6",
                    }}
                  >
                    <h3 style={{ color: "#384959" }}>ID: {credit.credit_id}</h3>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span style={{ color: "#4CAF50" }}>{credit.status}</span>
                    </p>
                    <p style={{ fontSize: "12px", color: "#999" }}>
                      Created: {new Date(credit.created_at).toLocaleDateString()}
                    </p>

                    {credit.status !== "Available" ||
                    (credit.status === "Available" && !credit.price) ? (
                      <div style={{ marginTop: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>
                          <strong>Set Price ($)</strong>
                        </label>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            type="number"
                            step="0.01"
                            value={listingPrice[credit.credit_id] || ""}
                            onChange={(e) =>
                              setListingPrice({
                                ...listingPrice,
                                [credit.credit_id]: e.target.value,
                              })
                            }
                            placeholder="e.g., 50.00"
                            style={{
                              flex: 1,
                              padding: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <button
                            onClick={() => handleListCredit(credit.credit_id)}
                            disabled={actionLoading === credit.credit_id}
                            style={{
                              backgroundColor:
                                actionLoading === credit.credit_id
                                  ? "#ccc"
                                  : "#4CAF50",
                              color: "white",
                              padding: "8px 15px",
                              border: "none",
                              borderRadius: "4px",
                              cursor:
                                actionLoading === credit.credit_id
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            List
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: "#c8e6c9",
                          padding: "10px",
                          borderRadius: "4px",
                          marginTop: "10px",
                        }}
                      >
                        <p style={{ margin: 0, color: "#2e7d32", fontWeight: "bold" }}>
                          ✅ Listed at ${credit.price}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Available Credits in Marketplace */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#384959", marginBottom: "20px" }}>
            🛍️ Credits Available for Purchase
          </h2>

          {availableCredits.length === 0 ? (
            <p style={{ color: "#666" }}>
              No credits available for purchase yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {availableCredits.map((credit) => (
                <div
                  key={credit.id}
                  style={{
                    border: "2px solid #2196F3",
                    padding: "15px",
                    borderRadius: "8px",
                    backgroundColor: "#e3f2fd",
                  }}
                >
                  <h3 style={{ color: "#384959" }}>ID: {credit.credit_id}</h3>

                  <p>
                    <strong>Seller:</strong> {credit.owner?.company_name}
                  </p>

                  <p style={{ fontSize: "25px", color: "#2196F3", fontWeight: "bold" }}>
                    💵 ${credit.price || "N/A"}
                  </p>

                  <p style={{ fontSize: "12px", color: "#999" }}>
                    Listed: {new Date(credit.listed_at).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => handleBuyCredit(credit.credit_id)}
                    disabled={actionLoading === credit.credit_id}
                    style={{
                      width: "100%",
                      backgroundColor:
                        actionLoading === credit.credit_id ? "#ccc" : "#2196F3",
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
                    {actionLoading === credit.credit_id
                      ? "Processing..."
                      : "🛒 Buy Now"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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

export default Marketplace;
