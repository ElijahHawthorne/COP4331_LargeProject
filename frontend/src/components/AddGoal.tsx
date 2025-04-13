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
  const [message, setMessage] = useState<string>("");
  const [messageColor, setMessageColor] = useState<string>("");

  const handleGoalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if userId is null
    if (userId === null) {
      console.log("User is not logged in");
      return; // Prevent form submission if userId is null
    }

    // Validate that the cost and payment amount are numbers
    if (isNaN(Number(goalCost)) || isNaN(Number(paymentAmount))) {
      console.log("Please enter valid numbers for cost and payment amount.");
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
        setMessage("Goal added successfully!");
        setMessageColor("success");
        setGoalName(""); // Reset fields
        setGoalCost(null);
        setPaymentAmount(null);
        setProgress(null); 
        setGoalDate("");
        // After adding goal, add expense
        
        const expenseData = {
          userId,
          expenseName: newGoal.name,
          expenseCost: newGoal.paymentAmount,
          expenseDate: newGoal.date,
          expenseCategory: "Saving Goal",
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
          console.log("Goal and expense added successfully!");
        } else {
          console.log(`Failed to add expense: ${expenseDataResponse.error}`);
        }
      } else {
        setMessage("Failed to add goal: " + goalData.error);
        setMessageColor("error");
        console.log(`Failed to add goal: ${goalData.error}`);
      }
    } catch (error) {
      console.error("Error submitting goal and expense:", error);
      console.log("An error occurred while adding the goal and expense.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2,paddingTop: 1, overflowY:"auto" }}>

      <form onSubmit={handleGoalSubmit}>
        <TextField
          label="Goal Name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          fullWidth
          required
          margin="normal"
          placeholder="Enter the name of your goal"
          InputLabelProps={{
            sx: {
              transform: 'translate(14px, 10px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -19px) scale(0.75)',
              },
            }
          }}
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
          InputLabelProps={{
            sx: {
              transform: 'translate(14px, 10px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -19px) scale(0.75)',
              },
            }
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
          InputLabelProps={{
            sx: {
              transform: 'translate(14px, 10px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -19px) scale(0.75)',
              },
            }
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
            sx: {
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -19px) scale(0.75)',
              },
            }
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
          InputLabelProps={{
            sx: {
              transform: 'translate(14px, 10px) scale(1)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -19px) scale(0.75)',
              },
            }
          }}
        />
        {message && (
        <Typography
          variant="body2"
          sx={{ marginTop: 2, color: messageColor === "success" ? "green" : "red" }}
        >
          {message}
        </Typography>
      )}
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
