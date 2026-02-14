import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#BDDDDC",
        padding: "60px 20px",
        textAlign: "center"
      }}
    >
      <h1
        style={{
          fontSize: "40px",
          marginBottom: "60px",
          color: "#384959"
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "40px"
        }}
      >
        {/* Apply Project */}
        <div
          onClick={() => navigate("/apply-project")}
          style={cardStyle}
        >
          Apply Green Project
        </div>

        {/* Marketplace */}
        <div
          onClick={() => navigate("/marketplace")}
          style={cardStyle}
        >
          Marketplace
        </div>

        {/* My Credits */}
        <div
          onClick={() => navigate("/my-credits")}
          style={cardStyle}
        >
          My Credits
        </div>

        {/* Transaction History */}
        <div
          onClick={() => navigate("/history")}
          style={cardStyle}
        >
          Transaction History
        </div>

        {/* Admin Panel */}
        <div
          onClick={() => navigate("/admin")}
          style={cardStyle}
        >
          Admin Panel
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  width: "280px",
  height: "120px",
  backgroundColor: "#6A89A7",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",
  fontSize: "18px",
  cursor: "pointer",
  transition: "0.3s",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
};

export default Dashboard;
