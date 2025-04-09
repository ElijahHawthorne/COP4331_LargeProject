import { useState, useEffect } from "react";

export function useExpenses(userId) {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const app_name = "777finances.com";
    const buildPath = (route) =>
      process.env.NODE_ENV !== "development"
        ? "http://" + app_name + ":5000/" + route
        : "http://localhost:5000/" + route;

    async function fetchExpenses() {
      try {
        const response = await fetch(buildPath("api/getexpenses"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const res = await response.json();
        if (res.expenses) setExpenses(res.expenses);
        else setError(res.error);
      } catch (err) {
        setError(err.toString());
      }
    }

    if (userId) fetchExpenses();
  }, [userId]);

  return { expenses, error };
}
