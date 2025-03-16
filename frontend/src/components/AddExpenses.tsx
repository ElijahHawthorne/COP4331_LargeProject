import React, { useState } from "react";

function AddExpenses() {
  const [expenseName, setExpenseName] = useState<string>("");
  const [expenseCost, setExpenseCost] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const app_name = "777finances.com";
  function buildPath(route: string): string {
    if (process.env.NODE_ENV !== "development") {
      return "http://" + app_name + ":5000/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
  }

  let _ud: any = localStorage.getItem("user_data");
  let ud = JSON.parse(_ud);
  let userId: string = ud.id;

  async function addExpense(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const obj = { userId, expenseName, expenseCost };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath("api/addexpense"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();

      if (res.success) {
        setMessage("Expense added successfully!");
      } else {
        setMessage("Failed to add expense: " + res.error);
      }
    } catch (error: any) {
      setMessage("An error occurred: " + error.toString());
    }
  }

  function handleExpenseNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setExpenseName(e.target.value);
  }

  function handleExpenseCostChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setExpenseCost(parseFloat(e.target.value));
  }

  return (
    <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      <form onSubmit={addExpense} className="w-full">
        <input
          type="text"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          placeholder="Expense Name"
          value={expenseName}
          onChange={handleExpenseNameChange}
        />
        <input
          type="number"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          placeholder="Expense Cost"
          value={expenseCost}
          onChange={handleExpenseCostChange}
        />
        <button
          type="submit"
          className="bg-accent text-white py-2 px-4 rounded hover:bg-orange w-full"
        >
          Add Expense
        </button>
      </form>
      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
}

export default AddExpenses;