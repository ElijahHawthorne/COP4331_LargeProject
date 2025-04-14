import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useColorScheme } from '@mui/material/styles';

interface AddExpensesProps {
  onRerender: () => void;
  userId: number | null;
}

function AddExpenses({ onRerender, userId }: AddExpensesProps) {
  const [expenseName, setExpenseName] = useState<string>("");
  const [expenseCost, setExpenseCost] = useState<number | null>(null);
  const [expenseCategory, setExpenseCategory] = useState<string>(""); // New state for category
  const [expenseDate, setExpenseDate] = useState<string>(""); // New state for date
  const [message, setMessage] = useState<string>("");
  const [messageColor, setMessageColor] = useState<string>("");
  const [recurring, setRecurring] = useState<boolean>(false);

  const { mode } = useColorScheme(); // 'light' | 'dark' | undefined
  const inputSx = {
    backgroundColor: mode === 'dark' ? 'hsl(219, 50%, 13%)' : '#fff',
    '& input': {
      backgroundColor: mode === 'dark' ? 'transparent' : '#fff',
      color: mode === 'dark' ? '#fff' : '#000',
    },
  };


  async function addExpense(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!userId) {
      alert("User is not logged in");
      return;
    }

    const obj = { userId: userId, expenseName: expenseName, expenseCost:expenseCost, expenseCategory: expenseCategory, expenseDate: expenseDate, recurring: recurring };
    const js = JSON.stringify(obj);
    console.log(js);
    try {
      const response = await fetch("http://777finances.com:5000/api/addexpense", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();

      if (res.success) {
        setMessage("Expense added successfully!");
        setMessageColor("success");
        onRerender();
        setExpenseName("");
        setExpenseCost(null);
        setExpenseCategory("");
        setExpenseDate("");
        setRecurring(false);
      } else {
        setMessage("Failed to add expense: " + res.error);
        setMessageColor("error");
      }

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error: any) {
      setMessage("An error occurred: " + error.toString());
      setMessageColor("error");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  }

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 1, paddingTop: 0, overflowY: "auto" }}>
      <Typography
        variant="caption"
        sx={{ color: "gray", fontStyle: "italic", display: "block" }}
      >
        * = Required Field
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
          InputLabelProps={{
            sx: {
              transform: 'translate(14px, 10px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -19px) scale(0.75)',
              },
            }
          }}
          InputProps={{
            sx: inputSx
          }}
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
            sx: inputSx,
            inputProps: {
              style: { WebkitAppearance: "none", MozAppearance: "textfield" }, // Hide arrows in number input
            },
          }}
          InputLabelProps={{
            sx: {
              transform: 'translate(14px, 10px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -19px) scale(0.75)',
              },
            }
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
          InputLabelProps={{
            sx: {
              transform: 'translate(14px, 10px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -19px) scale(0.75)',
              },
            }
          }}
          InputProps={{
            sx: {
              ...inputSx,
              '& .MuiSelect-select': {
                backgroundColor: mode === 'dark' ? 'hsl(219, 50%, 13%)' : '#fff',
                color: mode === 'dark' ? '#fff' : '#000',
                borderRadius: '8px',
                padding: '10px',
              },
            },
          }}
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
            shrink: true,
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
            />
          }
          label="Recurring Expense"
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
