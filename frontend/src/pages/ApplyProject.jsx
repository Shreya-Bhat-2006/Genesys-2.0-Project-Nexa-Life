import { useState } from "react";

function ApplyProject() {
  const [projectName, setProjectName] = useState("");
  const [type, setType] = useState("");
  const [reduction, setReduction] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Project submitted (dummy mode)");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Apply as Green Project</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Project Type (Solar/Wind)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="number"
          placeholder="CO₂ Reduction (tons)"
          value={reduction}
          onChange={(e) => setReduction(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ApplyProject;
