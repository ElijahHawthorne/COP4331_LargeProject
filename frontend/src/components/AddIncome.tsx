import React, { useState } from "react";

interface AddIncomeProps {
  userId: number | null;
  onIncomeAdded: () => void;
}

const AddIncome: React.FC<AddIncomeProps> = ({ userId, onIncomeAdded }) => {
  const [incomeAmount, setIncomeAmount] = useState<string>(""); // Use string for text input
  const [message, setMessage] = useState<string>("");

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User ID is missing.");
      return;
    }

    const parsedIncome = parseFloat(incomeAmount);
    if (isNaN(parsedIncome) || parsedIncome <= 0) {
      setMessage("Please enter a valid income amount.");
      return;
    }

    try {
      const response = await fetch("http://777finances.com:5000/api/editincome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newIncomeAmount: parsedIncome }),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        setMessage("Income added successfully!");
        setIncomeAmount(""); // Reset the input field
        onIncomeAdded(); // Refresh data
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage("An error occurred while adding income.");
      console.error("Error adding income:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Add Income</h2>
      <form onSubmit={handleAddIncome}>
        <input
          type="text" // Change input type to text
          placeholder="Income Amount"
          value={incomeAmount}
          onChange={(e) => setIncomeAmount(e.target.value)} // Update state with text input
          className="border p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Income
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default AddIncome;
