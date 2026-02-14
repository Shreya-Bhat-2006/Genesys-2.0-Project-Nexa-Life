import { useEffect, useState } from "react";
import API from "../services/api";

function Marketplace() {
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await API.get("/credits");
      setCredits(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch credits");
    }
  };

  const handleBuy = async (creditId, ownerEmail) => {
    const newOwner = prompt("Enter your email:");

    try {
      await API.post("/transfer-credit", {
        credit_id: creditId,
        current_owner_email: ownerEmail,
        new_owner_email: newOwner
      });

      alert("Credit transferred successfully");
      fetchCredits(); // refresh list
    } catch (error) {
      console.error(error);
      alert("Transfer failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Marketplace</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Credit ID</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((credit) => (
            <tr key={credit.credit_id}>
              <td>{credit.credit_id}</td>
              <td>{credit.owner_email}</td>
              <td>{credit.status}</td>
              <td>
                {credit.status === "Active" && (
                  <button
                    onClick={() =>
                      handleBuy(credit.credit_id, credit.owner_email)
                    }
                  >
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
