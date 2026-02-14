function Home() {
  return (
    <>
      <div style={{
        background: "linear-gradient(to right, #1b4f72, #2e86de)",
        color: "white",
        padding: "120px 20px",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          Transparent Carbon Credit Tracking
        </h1>

        <p style={{ fontSize: "20px", maxWidth: "700px", margin: "0 auto 30px" }}>
          Prevent fraud. Stop double counting. Build trust in green investments.
        </p>

        <a href="/login">
          <button style={{ marginRight: "15px" }}>Get Started</button>
        </a>
      </div>

      {/* About Section */}
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>About Our Platform</h2>
        <p style={{ maxWidth: "800px", margin: "20px auto", fontSize: "18px" }}>
          Our system tracks carbon credits after green projects are approved.
          Each credit is uniquely identified, permanently recorded,
          and cannot be reused once retired.
        </p>
      </div>

      {/* How It Works */}
      <div style={{ background: "#f4f6f8", padding: "80px 20px", textAlign: "center" }}>
        <h2>How It Works</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", marginTop: "40px" }}>
          <div style={{ width: "250px" }}>
            <h3>1. Project Approval</h3>
            <p>Green projects are verified and approved by admin.</p>
          </div>

          <div style={{ width: "250px" }}>
            <h3>2. Credit Issuance</h3>
            <p>Unique carbon credits are generated securely.</p>
          </div>

          <div style={{ width: "250px" }}>
            <h3>3. Transfer & Retire</h3>
            <p>Credits can be bought and retired permanently.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
