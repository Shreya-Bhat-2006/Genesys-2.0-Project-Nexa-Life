import { useState } from "react";
import axios from "axios";

function ApplyProject() {
  const [projectType, setProjectType] = useState("");
  const [details, setDetails] = useState("");
  const [co2Reduction, setCo2Reduction] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // You can connect real backend later
      // For now just show success message

      setMessage("Green Project Application Submitted Successfully ✅");

      setProjectType("");
      setDetails("");
      setCo2Reduction("");

    } catch (error) {
      setMessage("Something went wrong ❌");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#BDDDDC",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          width: "500px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#384959" }}>
          Apply as Green Project
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Project Type</label>
            <input
              type="text"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Project Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              style={{ ...inputStyle, height: "80px" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Estimated CO₂ Reduction (tons)</label>
            <input
              type="number"
              value={co2Reduction}
              onChange={(e) => setCo2Reduction(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#6A89A7",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Submit Application
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", color: "green" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

export default ApplyProject;
