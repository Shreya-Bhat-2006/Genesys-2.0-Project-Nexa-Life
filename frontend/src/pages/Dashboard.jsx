import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "60px 40px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Dashboard</h2>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        flexWrap: "wrap"
      }}>
        <div style={cardStyle} onClick={() => navigate("/apply-project")}>
          <h3>Apply as Green Project</h3>
        </div>

        <div style={cardStyle} onClick={() => navigate("/marketplace")}>
          <h3>Marketplace</h3>
        </div>

        <div style={cardStyle} onClick={() => navigate("/my-credits")}>
          <h3>My Credits</h3>
        </div>

        <div style={cardStyle} onClick={() => navigate("/verify")}>
          <h3>Verify Credits</h3>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  width: "250px",
  height: "150px",
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer"
};

export default Dashboard;
