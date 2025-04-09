import React, { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";

interface AddExpensesProps {
  onRerender: () => void; // onRerender is a function with no arguments and no return value
  userId: number | null;
}

function AddExpenses({ onRerender, userId }: AddExpensesProps) {
  const [expenseName, setExpenseName] = useState<string>("");
  const [expenseCost, setExpenseCost] = useState<number | null>(null);
  const [expenseCategory, setExpenseCategory] = useState<string>(""); // New state for category
  const [expenseDate, setExpenseDate] = useState<string>(""); // New state for date
  const [message, setMessage] = useState<string>("");
  const [messageColor, setMessageColor] = useState<string>("");

  const app_name = "777finances.com";

  function buildPath(route: string): string {
    return "http://" + app_name + ":5000/" + route;
  }

  async function addExpense(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!userId) {
      alert("User is not logged in");
      return;
    }

    const obj = { userId, expenseName, expenseCost, expenseCategory, expenseDate };
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
        setMessageColor("success");
        onRerender(); // Trigger re-render by calling parent function
        setExpenseName(""); // Reset fields
        setExpenseCost(null);
        setExpenseCategory("");
        setExpenseDate("");
      } else {
        setMessage("Failed to add expense: " + res.error);
        setMessageColor("error");
      }

      // Clear the message after 2 seconds
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error: any) {
      setMessage("An error occurred: " + error.toString());
      setMessageColor("error");

      // Clear the message after 2 seconds
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  }

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add a New Expense
      </Typography>

      <form onSubmit={addExpense}>
        <TextField
          label="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter the name of the expense"
        />
        <TextField
          label="Expense Cost"
          type="number"
          value={expenseCost || ""}
          onChange={(e) => setExpenseCost(e.target.value ? parseFloat(e.target.value) : null)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter the cost of the expense"
          InputProps={{
            inputProps: {
              style: { WebkitAppearance: "none", MozAppearance: "textfield" }, // Hide arrows in number input
            },
          }}
        />
        
        {/* Category was previously a TextField, but now it will be the Select component */}
        <TextField
          label="Expense Category"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter the category of the expense"
          select
        >
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Transportation">Transportation</MenuItem>
          <MenuItem value="Utilities">Utilities</MenuItem>
          <MenuItem value="Entertainment">Entertainment</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField
          label="Expense Date"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true, // Ensure the label stays above the input
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Add Expense
        </Button>
      </form>

      {message && (
        <Typography
          variant="body2"
          sx={{ marginTop: 2, color: messageColor === "success" ? "green" : "red" }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default AddExpenses;
