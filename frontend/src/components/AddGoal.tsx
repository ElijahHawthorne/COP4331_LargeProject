import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Goal } from "../Types";

interface AddGoalProps {
  userId: number | null; // Allow null as userId is optional at first
  onGoalAdded: () => void;
}

const AddGoal: React.FC<AddGoalProps> = ({ userId, onGoalAdded }) => {
  const [goalName, setGoalName] = useState("");
  const [goalCost, setGoalCost] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [goalDate, setGoalDate] = useState("");
  const [progress, setProgress] = useState<number | null>(null); // Progress is added, and it will be set to 0 initially

  const handleGoalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if userId is null
    if (userId === null) {
      alert("User is not logged in");
      return; // Prevent form submission if userId is null
    }

    // Validate that the cost and payment amount are numbers
    if (isNaN(Number(goalCost)) || isNaN(Number(paymentAmount))) {
      alert("Please enter valid numbers for cost and payment amount.");
      return;
    }

    const newGoal: Goal = {
      name: goalName,
      cost: Number(goalCost),
      paymentAmount: Number(paymentAmount),
      progress: Number(progress), // Progress value passed in the API call
      date: goalDate,
    };

    try {
      // Send goal data to the server
      const goalResponse = await fetch(
        "http://777finances.com:5000/api/addgoal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            goalName: newGoal.name,
            goalCost: newGoal.cost,
            paymentAmount: newGoal.paymentAmount,
            payDate: newGoal.date,
            paymentProgress: newGoal.progress, // Add progress in the request body for the API
          }),
        }
      );

      const goalData = await goalResponse.json();

      if (goalData.success) {
        // After adding goal, add expense
        const expenseData = {
          userId,
          expenseName: newGoal.name,
          expenseCost: newGoal.paymentAmount,
          expenseDate: newGoal.date,
          expenseCategory: "saving goal",
        };

        const expenseResponse = await fetch(
          "http://777finances.com:5000/api/addexpense",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(expenseData),
          }
        );

        const expenseDataResponse = await expenseResponse.json();

        if (expenseDataResponse.success) {
          onGoalAdded();
          alert("Goal and expense added successfully!");
        } else {
          alert(`Failed to add expense: ${expenseDataResponse.error}`);
        }
      } else {
        alert(`Failed to add goal: ${goalData.error}`);
      }
    } catch (error) {
      console.error("Error submitting goal and expense:", error);
      alert("An error occurred while adding the goal and expense.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2, overflowY:"auto" }}>
      <Typography variant="h6">Add a New Goal</Typography>

      <form onSubmit={handleGoalSubmit}>
        <TextField
          label="Goal Name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter the name of your goal"
        />
        <TextField
          label="Goal Cost"
          type="number"
          value={goalCost || ""}
          onChange={(e) => setGoalCost(e.target.value ? Number(e.target.value) : null)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter the total amount"
          InputProps={{
            inputProps: {
              style: { WebkitAppearance: "none", MozAppearance: "textfield" }, // Hide arrows in number input
            },
          }}
        />
        <TextField
          label="Payment Amount"
          type="number"
          value={paymentAmount || ""}
          onChange={(e) => setPaymentAmount(e.target.value ? Number(e.target.value) : null)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter the amount to be paid every month"
          InputProps={{
            inputProps: {
              style: { WebkitAppearance: "none", MozAppearance: "textfield" }, // Hide arrows in number input
            },
          }}
        />
        <TextField
          label="Target Date"
          type="date"
          value={goalDate}
          onChange={(e) => setGoalDate(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Enter the date of your goal"
        />
        <TextField
          label="Progress"
          type="number"
          value={progress || ""}
          onChange={(e) => setProgress(e.target.value ? Number(e.target.value) : null)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter your progress toward this goal"
          InputProps={{
            inputProps: {
              style: { WebkitAppearance: "none", MozAppearance: "textfield" }, // Hide arrows in number input
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Add Goal
        </Button>
      </form>
    </Box>
  );
};

export default AddGoal;
