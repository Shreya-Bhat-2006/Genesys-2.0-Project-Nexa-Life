import { useEffect, useState } from "react";
import API from "../api";

function Marketplace() {
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await API.get("/credits");
      setCredits(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="section">
      <h2>Marketplace</h2>

      <div className="cards">
        {credits.map((credit) => (
          <div className="card" key={credit.credit_id}>
            <h3>{credit.credit_id}</h3>
            <p>Status: {credit.status}</p>
            <p>Owner: {credit.owner_email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
