import React, { useState, useEffect } from "react";

function ViewFunds() {
  const [curFunds, setCurFunds] = useState(0);
  const [message, setMessage] = useState("");

  const app_name = "777finances.com";
  function buildPath(route) {
    if (process.env.NODE_ENV !== "development") {
      return "http://" + app_name + ":5000/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
  }

  let _ud = localStorage.getItem("user_data");
  let ud = JSON.parse(_ud);
  let userId = ud.id;

  useEffect(() => {
    async function fetchFunds() {
      try {
        const response = await fetch(buildPath("api/getfunds"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });

        const res = await response.json();

        if (res.funds) {
          setCurFunds(res.funds);
        } else {
          setMessage("Failed to fetch current funds: " + res.error);
        }
      } catch (error) {
        setMessage("An error occurred: " + error.toString());
      }
    }

    fetchFunds();
  }, [userId]);

  return (
    <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Your Total Funds</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      ${curFunds}
    </div>
  );
}

export default ViewFunds;