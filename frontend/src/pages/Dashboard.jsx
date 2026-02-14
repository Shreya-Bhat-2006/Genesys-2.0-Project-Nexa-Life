import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <div style={{ marginTop: "20px" }}>
        <Link to="/apply-project">
          <button style={{ marginRight: "10px" }}>
            Apply as Green Project
          </button>
        </Link>

        <Link to="/marketplace">
          <button style={{ marginRight: "10px" }}>
            Buy Carbon Credits
          </button>
        </Link>

        <Link to="/my-credits">
          <button>
            View My Credits
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
