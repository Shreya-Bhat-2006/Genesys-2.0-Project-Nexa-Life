import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("loggedIn");
    if (status === "true") setLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "15px 40px", background: "#1b4f72", color: "white" }}>
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
        Green Carbon Ledger
      </div>

      <div>
        {!loggedIn ? (
          <>
            <Link to="/" style={{ color: "white", marginRight: "20px" }}>Home</Link>
            <Link to="/login" style={{ color: "white", marginRight: "20px" }}>Login</Link>
            <Link to="/register" style={{ color: "white" }}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={{ color: "white", marginRight: "20px" }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ background: "white", color: "#1b4f72" }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
