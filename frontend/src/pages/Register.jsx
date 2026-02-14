import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: "",
    email: "",
    password: "",
    role: "company",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/register", form);
      navigate("/dashboard");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input name="company_name" placeholder="Company Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <button className="btn-primary full">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
