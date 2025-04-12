import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

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
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2, paddingTop: 1 }}>

      {message && (
        <Typography
          variant="body2"
          sx={{ marginBottom: 2, color: message.includes("success") ? "green" : "red" }}
        >
          {message}
        </Typography>
      )}

      <form onSubmit={handleAddIncome}>
        <TextField
          label="Income Amount"
          type="text" // Keep input type as text for better validation
          value={incomeAmount}
          onChange={(e) => setIncomeAmount(e.target.value)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter your income amount"
          InputLabelProps={{
            sx: {
              transform: 'translate(14px, 10px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -19px) scale(0.75)',
              },
            }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Add Income
        </Button>
      </form>
    </Box>
  );
};

export default AddIncome;
