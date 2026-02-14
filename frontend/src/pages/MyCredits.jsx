import { useState } from "react";

function MyCredits() {
  const [credits, setCredits] = useState([
    { id: "CC-001", status: "Active" },
    { id: "CC-002", status: "Retired" }
  ]);

  const handleRetire = (id) => {
    alert(`Credit ${id} retired (dummy mode)`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Credits</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Credit ID</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((credit) => (
            <tr key={credit.id}>
              <td>{credit.id}</td>
              <td>{credit.status}</td>
              <td>
                {credit.status === "Active" && (
                  <button onClick={() => handleRetire(credit.id)}>
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
