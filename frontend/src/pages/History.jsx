import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [credits, setCredits] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/credits", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setCredits(res.data))
    .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Transaction History</h2>

      {credits.map(credit => (
        <div key={credit.credit_id} style={{ marginBottom: "20px" }}>
          <h4>Credit ID: {credit.credit_id}</h4>

          {credit.history?.map((h, index) => (
            <p key={index}>
              {h.action} | {h.timestamp}
            </p>
          ))}

          <hr />
        </div>
      ))}
    </div>
  );
}

export default History;
