import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const API = "http://127.0.0.1:8000";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    password: "",
    role: "company"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/register`, formData);

      alert("Registration successful!");
      navigate("/login"); // go to login after register
    } catch (error) {
      console.error(error);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          >
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
