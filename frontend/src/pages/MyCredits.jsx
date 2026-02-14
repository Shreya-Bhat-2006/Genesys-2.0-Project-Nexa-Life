import { useState } from "react";
import API from "../services/api";

function MyCredits() {
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState([]);

  const fetchCredits = async () => {
    try {
      const res = await API.get("/credits");
      const owned = res.data.filter(c => c.owner_email === email);
      setCredits(owned);
    } catch {
      alert("Error fetching credits");
    }
  };

  const retireCredit = async (creditId) => {
    try {
      await API.post("/use-credit", {
        credit_id: creditId,
        owner_email: email
      });

      alert("Credit retired");
      fetchCredits();
    } catch {
      alert("Failed to retire");
    }
  };

  return (
    <div className="container">
      <h2>My Credits</h2>

      <input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={fetchCredits}>Load My Credits</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((c) => (
            <tr key={c.credit_id}>
              <td>{c.credit_id}</td>
              <td>{c.status}</td>
              <td>
                {c.status === "Active" && (
                  <button onClick={() => retireCredit(c.credit_id)}>
                    Retire
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyCredits;
