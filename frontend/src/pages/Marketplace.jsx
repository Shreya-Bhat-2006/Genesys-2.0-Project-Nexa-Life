import API from "../services/api";
import { useEffect, useState } from "react";

function Marketplace() {
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    API.get("/marketplace").then((res) => {
      setCredits(res.data);
    });
  }, []);

  return (
    <div className="page-container">
      <h2>Marketplace</h2>

      {credits.map((credit) => (
        <div key={credit.credit_id} className="card">
          <p>ID: {credit.credit_id}</p>
          <p>Status: {credit.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Marketplace;
