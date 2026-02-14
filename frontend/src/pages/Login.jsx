function Login() {
  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Login</h2>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button className="btn-primary full">Login</button>
      </div>
    </div>
  );
}

export default Login;
