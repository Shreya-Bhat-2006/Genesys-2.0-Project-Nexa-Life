import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingProjects, approveProject, rejectProject } from "../api";

function AdminPanel() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      const res = await getPendingProjects();
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("❌ Only admins can access this page");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (projectId) => {
    if (!window.confirm("Approve this project and generate credits?")) return;

    setActionLoading(projectId);
    try {
      const res = await approveProject(projectId);
      alert(`✅ ${res.data.message}`);
      fetchPendingProjects();
    } catch (error) {
      alert("❌ Error: " + (error.response?.data?.detail || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (projectId) => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;

    setActionLoading(projectId);
    try {
      const res = await rejectProject(projectId, reason);
      alert(`⛔ ${res.data.message}`);
      fetchPendingProjects();
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
          👨‍💼 Admin Panel - Project Approvals
        </h1>

        {projects.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "18px", color: "#666" }}>
              No pending projects at this time! ✅
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "30px",
            }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "2px solid #FFA500",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#FFF3E0",
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "15px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "#FFA500", fontWeight: "bold", margin: 0 }}>
                    ⏳ PENDING APPROVAL
                  </p>
                </div>

                <h2 style={{ color: "#384959", marginBottom: "10px" }}>
                  {project.project_name}
                </h2>

                <p style={{ color: "#666", marginBottom: "15px" }}>
                  <strong>Owner:</strong> {project.owner?.company_name}
                </p>

                <p style={{ color: "#666", marginBottom: "15px" }}>
                  <strong>Description:</strong>{" "}
                  {project.description || "No description provided"}
                </p>

                <p style={{ color: "#384959", fontWeight: "bold", marginBottom: "15px" }}>
                  📊 Credits to Generate: <span style={{ color: "#4CAF50" }}>{project.credits_count}</span>
                </p>

                <p style={{ fontSize: "12px", color: "#999", marginBottom: "20px" }}>
                  Applied on: {new Date(project.created_at).toLocaleDateString()}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    onClick={() => handleApprove(project.id)}
                    disabled={actionLoading === project.id}
                    style={{
                      flex: 1,
                      backgroundColor:
                        actionLoading === project.id ? "#ccc" : "#4CAF50",
                      color: "white",
                      padding: "10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor:
                        actionLoading === project.id ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {actionLoading === project.id ? "Processing..." : "✅ Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(project.id)}
                    disabled={actionLoading === project.id}
                    style={{
                      flex: 1,
                      backgroundColor:
                        actionLoading === project.id ? "#ccc" : "#f44336",
                      color: "white",
                      padding: "10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor:
                        actionLoading === project.id ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {actionLoading === project.id ? "Processing..." : "❌ Reject"}
                  </button>
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

export default AdminPanel;
