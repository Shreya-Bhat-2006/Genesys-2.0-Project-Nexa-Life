import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applyAsGreenProject, getMyProjects } from "../api";

function ApplyProject() {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [creditsCount, setCreditsCount] = useState("");
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const res = await getMyProjects();
      setMyProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!projectName || !creditsCount) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await applyAsGreenProject({
        project_name: projectName,
        description: description,
        credits_count: parseInt(creditsCount),
      });

      alert("✅ Project submitted! Waiting for admin approval...");

      setProjectName("");
      setDescription("");
      setCreditsCount("");
      setShowForm(false);

      fetchMyProjects();
    } catch (error) {
      alert("❌ Error: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "approved":
        return "#4CAF50";
      case "rejected":
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
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1
          style={{
            color: "#384959",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          🌱 Apply as Green Project
        </h1>

        {/* ================= MY PROJECTS ================= */}
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
            My Projects
          </h2>

          {myProjects.length === 0 ? (
            <p style={{ color: "#666" }}>
              No projects yet. Create one below!
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {myProjects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    border: "2px solid #BDDDDC",
                    padding: "15px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <h3 style={{ color: "#384959" }}>
                    {project.project_name}
                  </h3>

                  <p style={{ color: "#666" }}>
                    Description: {project.description || "N/A"}
                  </p>

                  <p>
                    <strong>Credits Count:</strong>{" "}
                    {project.credits_count}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: getStatusColor(project.status),
                        fontWeight: "bold",
                      }}
                    >
                      {project.status?.toUpperCase()}
                    </span>
                  </p>

                  {project.approval_date && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      Approved on:{" "}
                      {new Date(
                        project.approval_date
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= APPLY FORM ================= */}
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#384959",
              marginBottom: "20px",
              cursor: "pointer",
            }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "▼" : "▶"} Create New Project
          </h2>

          {showForm && (
            <form onSubmit={handleApply}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Project Name *
                </label>

                <input
                  type="text"
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(e.target.value)
                  }
                  placeholder="e.g., Solar Power Initiative"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe your green project..."
                  style={{ ...inputStyle, minHeight: "100px" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Number of Credits *
                </label>

                <input
                  type="number"
                  value={creditsCount}
                  onChange={(e) =>
                    setCreditsCount(e.target.value)
                  }
                  placeholder="e.g., 100"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading
                    ? "#ccc"
                    : "#4CAF50",
                  color: "white",
                  padding: "12px 30px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Application"}
              </button>
            </form>
          )}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "30px",
            backgroundColor: "#384959",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box",
};

export default ApplyProject;
