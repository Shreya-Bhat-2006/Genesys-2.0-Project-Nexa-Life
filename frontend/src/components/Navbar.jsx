import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      style={{
        backgroundColor: "#384959",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white"
      }}
    >
      <h2 style={{ margin: 0 }}>Green Carbon Ledger</h2>

      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/register" style={linkStyle}>Register</Link>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  marginLeft: "20px",
  textDecoration: "none",
  fontSize: "16px"
};

export default Navbar;
