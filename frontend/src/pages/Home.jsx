function Landing() {
  return (
    <>
      <section
        style={{
          background: "linear-gradient(135deg, #384959, #6A89A7)",
          color: "white",
          padding: "120px 20px",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: "700", marginBottom: "20px" }}>
          Green Carbon Ledger
        </h1>

        <p style={{ fontSize: "20px", maxWidth: "700px", margin: "0 auto 40px" }}>
          A secure and transparent carbon credit marketplace that prevents fraud,
          eliminates double counting, and builds trust in green investments.
        </p>

        <div>
          <a href="/login">
            <button
              style={{
                backgroundColor: "#88BDF2",
                color: "#384959",
                padding: "12px 28px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                marginRight: "15px",
                cursor: "pointer"
              }}
            >
              Login
            </button>
          </a>

          <a href="/register">
            <button
              style={{
                backgroundColor: "white",
                color: "#384959",
                padding: "12px 28px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Register
            </button>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section
        style={{
          backgroundColor: "#BDDDFC",
          padding: "80px 20px",
          textAlign: "center"
        }}
      >
        <h2 style={{ fontSize: "32px", marginBottom: "20px", color: "#384959" }}>
          How It Works
        </h2>

        <p style={{ maxWidth: "800px", margin: "0 auto", fontSize: "18px", color: "#384959" }}>
          Projects are approved by admin, carbon credits are issued with unique IDs,
          and every transaction is permanently recorded in a tamper-resistant ledger.
          Once retired, credits cannot be reused.
        </p>
      </section>
    </>
  );
}

export default Landing;
