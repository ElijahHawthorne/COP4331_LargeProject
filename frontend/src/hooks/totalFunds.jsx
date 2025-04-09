import React, { useState, useEffect } from "react";

export function totalFunds(userId) {
  const [curFunds, setCurFunds] = useState(0);
  const [message, setMessage] = useState("");

useEffect(() => {
    const app_name = "777finances.com";
    const buildPath = (route) =>
      process.env.NODE_ENV !== "development"
        ? "http://" + app_name + ":5000/" + route
        : "http://localhost:5000/" + route;
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
  return { curFunds };
}