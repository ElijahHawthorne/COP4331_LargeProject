import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  TextField,
  Button,
  Typography,
} from "@mui/material";

interface AddIncomeProps {
  userId: number | null;
  onIncomeAdded: () => void;
}

const AddIncome: React.FC<AddIncomeProps> = ({ userId, onIncomeAdded }) => {
  const [incomeAmount, setIncomeAmount] = useState<string>("");
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
    } catch (error: unknown) {
      setMessage("An error occurred while adding income.");
      console.error("Error adding income:", error);
    }
  };

  return (
    <Card>
      <CardHeader title="Add Income" />
      <Divider />
      <CardContent>
        <form onSubmit={handleAddIncome} noValidate>
          <TextField
            fullWidth
            variant="outlined"
            label="Income Amount"
            type="number"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Add Income
          </Button>
        </form>
        {message && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AddIncome;
