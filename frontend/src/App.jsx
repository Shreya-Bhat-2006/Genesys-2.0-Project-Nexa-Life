import Navbar from "./components/Navbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import MyCredits from "./pages/MyCredits";
import ApplyProject from "./pages/ApplyProject";
import AdminPanel from "./pages/AdminPanel";
import History from "./pages/History";

function App() {
  return (
    <Router>

      {/* ✅ THIS LINE WAS MISSING */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/my-credits" element={<MyCredits />} />
        <Route path="/apply" element={<ApplyProject />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
