import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCredits } from "../api";

function History() {
  const navigate = useNavigate();
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getMyCredits();
      setCredits(res.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
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
          📜 My Transaction History
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
              No transaction history yet.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
            }}
          >
            {credits
              .filter((credit) => credit.history && credit.history.length > 0)
              .map((credit) => (
                <div
                  key={credit.id}
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3
                    style={{
                      color: "#384959",
                      marginBottom: "15px",
                      wordBreak: "break-all",
                    }}
                  >
                    Credit: {credit.credit_id}
                  </h3>

                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      padding: "10px",
                      borderRadius: "4px",
                      marginBottom: "15px",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      <strong>Current Status:</strong>{" "}
                      <span style={{ color: "#2196F3", fontWeight: "bold" }}>
                        {credit.status}
                      </span>
                    </p>
                  </div>

                  <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    📅 Events:
                  </p>

                  <div
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
                      borderLeft: "3px solid #2196F3",
                      paddingLeft: "15px",
                    }}
                  >
                    {credit.history.map((event, idx) => (
                      <div key={idx} style={{ marginBottom: "15px" }}>
                        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                          {event.action}
                        </p>

                        {event.from_owner && (
                          <p style={{ margin: "0 0 3px 0", fontSize: "13px", color: "#666" }}>
                            <strong>From:</strong> {event.from_owner}
                          </p>
                        )}

                        {event.to_owner && (
                          <p style={{ margin: "0 0 3px 0", fontSize: "13px", color: "#666" }}>
                            <strong>To:</strong> {event.to_owner}
                          </p>
                        )}

                        {event.details && (
                          <p style={{ margin: "0 0 3px 0", fontSize: "12px", color: "#999" }}>
                            {event.details}
                          </p>
                        )}

                        <p style={{ margin: "3px 0 0 0", fontSize: "11px", color: "#999" }}>
                          ⏰ {new Date(event.timestamp).toLocaleString()}
                        </p>

                        {idx < credit.history.length - 1 && (
                          <hr
                            style={{
                              margin: "10px 0",
                              borderColor: "#ddd",
                              borderTop: "1px solid #e0e0e0",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
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

export default History;
