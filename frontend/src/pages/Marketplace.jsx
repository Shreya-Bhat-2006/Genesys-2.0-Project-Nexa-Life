import { useState } from "react";

function Marketplace() {
  const [credits, setCredits] = useState([
    { id: "CC-001", project: "Solar Plant", status: "Active" },
    { id: "CC-002", project: "Wind Farm", status: "Active" }
  ]);

  const handleBuy = (id) => {
    alert(`Credit ${id} purchased (dummy mode)`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Marketplace</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Credit ID</th>
            <th>Project</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((credit) => (
            <tr key={credit.id}>
              <td>{credit.id}</td>
              <td>{credit.project}</td>
              <td>{credit.status}</td>
              <td>
                <button onClick={() => handleBuy(credit.id)}>
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Marketplace;
