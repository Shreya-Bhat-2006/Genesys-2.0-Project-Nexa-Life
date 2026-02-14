import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#e6f2f2" }}>
      <Link to="/" style={{ marginRight: "15px" }}>Login</Link>
      <Link to="/register" style={{ marginRight: "15px" }}>Register</Link>
      <Link to="/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>
      <Link to="/apply-project" style={{ marginRight: "15px" }}>Apply Project</Link>
      <Link to="/marketplace" style={{ marginRight: "15px" }}>Marketplace</Link>
      <Link to="/my-credits" style={{ marginRight: "15px" }}>My Credits</Link>
      <Link to="/verify">Verify</Link>
    </nav>
  );
}

export default Navbar;
