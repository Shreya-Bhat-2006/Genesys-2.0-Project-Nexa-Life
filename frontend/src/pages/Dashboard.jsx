import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "40px" }}>
        Dashboard
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap"
        }}
      >
        <Link to="/apply-project" className="dashboard-card">
          Apply Green Project
        </Link>

        <Link to="/marketplace" className="dashboard-card">
          Marketplace
        </Link>

        <Link to="/my-credits" className="dashboard-card">
          My Credits
        </Link>

        <Link to="/transactions" className="dashboard-card">
          Transaction History
        </Link>

        <Link to="/admin" className="dashboard-card">
          Admin Panel
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
