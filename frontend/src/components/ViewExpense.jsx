import React, { useState, useEffect } from "react";
import { PieChart } from '@mui/x-charts';

function ViewExpense() {
  const [expenses, setExpenses] = useState([]);
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
    async function fetchExpenses() {
      try {
        const response = await fetch(buildPath("api/getexpenses"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });

        const res = await response.json();

        if (res.expenses) {
          setExpenses(res.expenses);
        } else {
          setMessage("Failed to fetch expenses: " + res.error);
        }
      } catch (error) {
        setMessage("An error occurred: " + error.toString());
      }
    }

    fetchExpenses();
  }, [userId]);

  return (
    <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Your Expenses</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <ul className="w-full">
          {expenses.map((expense, index) => (
            <li key={index} className="mb-2 p-2 border border-gray-300 rounded">
              <p className="font-bold">{expense.name}</p>
              <p>Cost: ${expense.cost}</p>
              <p>Time: {expense.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <PieChart
        series={[
          {
            data: expenses.map((expense, index) => ({
              id: index,
              value: expense.cost,
              label: expense.name
            })),
          },
        ]}
        width={400}
        height={200}
      />
      </div>
    </div>
  );
}

export default ViewExpense;