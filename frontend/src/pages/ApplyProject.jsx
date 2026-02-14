function ApplyProject() {
  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Apply as Green Project</h2>
        <input type="text" placeholder="Project Name" />
        <input type="text" placeholder="Project Type (Solar/Wind)" />
        <input type="number" placeholder="Estimated CO2 Reduction" />
        <button className="btn-primary full">Submit</button>
      </div>
    </div>
  );
}

export default ApplyProject;
