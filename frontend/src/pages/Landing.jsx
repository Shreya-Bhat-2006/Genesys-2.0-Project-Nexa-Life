function Landing() {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay">
          <h1>Green Carbon Ledger</h1>
          <p>Secure  Verifiable  Tamper-Resistant </p>
          <div className="hero-buttons">
            <a href="/login" className="btn-primary">Login</a>
            <a href="/register" className="btn-secondary">Register</a>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>About Our Platform</h2>
        <p>
          Green Carbon Ledger ensures that every carbon credit is uniquely tracked,
          transparently traded, and permanently recorded in a secure ledger system.
        </p>
      </section>

      <section className="cards">
        <div className="card">
          <h3>Secure</h3>
          <p>All transactions recorded permanently in a tamper-resistant ledger.</p>
        </div>
        <div className="card">
          <h3>Transparent</h3>
          <p>Anyone can verify credit status using unique ID.</p>
        </div>
        <div className="card">
          <h3>Fraud-Proof</h3>
          <p>Once retired, credits cannot be reused or resold.</p>
        </div>
      </section>
    </>
  );
}

export default Landing;
