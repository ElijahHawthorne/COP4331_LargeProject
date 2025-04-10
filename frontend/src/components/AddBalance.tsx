import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

interface AddBalanceProps {
  userId: number | null;
  onBalanceAdded: () => void;
}

const AddBalance: React.FC<AddBalanceProps> = ({ userId, onBalanceAdded }) => {
  const [balanceAmount, setBalanceAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const app_name = "777finances.com";

  function buildPath(route: string): string {
    return "http://" + app_name + ":5000/" + route;
  }

  async function handleAddBalance(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!userId) {
      setMessage("User is not logged in.");
      return;
    }

    const parsedAmount = parseFloat(balanceAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage("Please enter a valid balance amount.");
      return;
    }

    try {
      // Use the /api/editbalance endpoint and pass newBalance instead of addAmount
      const response = await fetch(buildPath("api/editbalance"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newBalance: parsedAmount }),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        setMessage("Balance updated successfully!");
        setBalanceAmount(""); // Reset the input field
        onBalanceAdded(); // Refresh data from parent
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error: any) {
      setMessage("An error occurred while updating balance.");
      console.error("Error updating balance:", error);
    }

    // Clear the message after 2 seconds
    setTimeout(() => setMessage(""), 2000);
  }

  return (
    <Box component="form" onSubmit={handleAddBalance} noValidate sx={{ p: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Amount to Add"
        type="number"
        value={balanceAmount}
        onChange={(e) => setBalanceAmount(e.target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Update Balance
      </Button>
      {message && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default AddBalance;
