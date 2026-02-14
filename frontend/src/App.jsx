import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ApplyProject from "./pages/ApplyProject";
import Marketplace from "./pages/Marketplace";
import MyCredits from "./pages/MyCredits";
import PublicVerify from "./pages/PublicVerify";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply-project" element={<ApplyProject />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/my-credits" element={<MyCredits />} />
        <Route path="/verify" element={<PublicVerify />} />
      </Routes>
    </>
  );
}

export default App;
