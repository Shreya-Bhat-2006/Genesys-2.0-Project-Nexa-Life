function Register() {
  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Register</h2>
        <input type="text" placeholder="Company Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button className="btn-primary full">Register</button>
      </div>
    </div>
  );
}

export default Register;
