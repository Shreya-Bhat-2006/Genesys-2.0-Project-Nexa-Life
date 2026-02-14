import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ApplyProject from "./pages/ApplyProject";
import Marketplace from "./pages/Marketplace";
import MyCredits from "./pages/MyCredits";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply" element={<ApplyProject />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/mycredits" element={<MyCredits />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
