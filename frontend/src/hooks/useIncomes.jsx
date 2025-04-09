import { useState, useEffect } from "react";

export function useIncomes(userId) {
  const [incomes, setIncomes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const app_name = "777finances.com";
    const buildPath = (route) =>
      process.env.NODE_ENV !== "development"
        ? "http://" + app_name + ":5000/" + route
        : "http://localhost:5000/" + route;

    async function fetchIncomes() {
      try {
        const response = await fetch(buildPath("api/getincomes"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const res = await response.json();
        if (res.incomes) setIncomes(res.incomes);
        else setError(res.error);
      } catch (err) {
        setError(err.toString());
      }
    }

    if (userId) fetchIncomes();
  }, [userId]);

  return { incomes };
}
