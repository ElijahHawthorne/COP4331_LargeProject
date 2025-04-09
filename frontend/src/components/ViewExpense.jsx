import React, { useState, useEffect } from "react";
import { PieChart } from '@mui/x-charts';
import { useExpenses } from "../hooks/useExpenses";


function ViewExpense() {
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

  const { expenses, error } = useExpenses(userId);

  return (
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

  );
}

export default ViewExpense;