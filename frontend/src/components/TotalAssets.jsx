import React, { useState, useEffect } from "react";
import { totalFunds as useTotalFunds } from "../hooks/totalFunds";

function ViewFunds() {
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

  const { curFunds } = useTotalFunds(userId);

  return (
    <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Your Total Funds</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      ${curFunds}
    </div>
  );
}

export default ViewFunds;