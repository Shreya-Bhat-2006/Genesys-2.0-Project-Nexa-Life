import { useEffect, useState } from "react";
import API from "../services/api";

function Marketplace() {
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await API.get("/credits");
      setCredits(res.data);
    } catch {
      alert("Failed to fetch credits");
    }
  };

  const handleBuy = async (creditId, ownerEmail) => {
    const newOwner = prompt("Enter your email");

    try {
      await API.post("/transfer-credit", {
        credit_id: creditId,
        current_owner_email: ownerEmail,
        new_owner_email: newOwner
      });

      alert("Transferred successfully");
      fetchCredits();
    } catch {
      alert("Transfer failed");
    }
  };

  return (
    <div className="container">
      <h2>Marketplace</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((c) => (
            <tr key={c.credit_id}>
              <td>{c.credit_id}</td>
              <td>{c.owner_email}</td>
              <td>{c.status}</td>
              <td>
                {c.status === "Active" && (
                  <button onClick={() => handleBuy(c.credit_id, c.owner_email)}>
                    Buy
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

export default Marketplace;
