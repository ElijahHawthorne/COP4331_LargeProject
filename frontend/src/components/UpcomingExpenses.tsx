import React, { useState, useEffect } from "react";
import { Expense } from "../Types";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface UpcomingExpensesCardProps {
  expenses: Expense[];
}

const UpcomingExpensesCard: React.FC<UpcomingExpensesCardProps> = ({ expenses }) => {
<<<<<<< HEAD
  const theme = useTheme();
  // Local state to track current expenses
=======
  // Local state to track upcoming expenses
>>>>>>> origin/NewEliBranch
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(expenses);

  // Update local state when props change
  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

<<<<<<< HEAD
  // When an expense is marked as paid, remove it from the list.
  const handleExpensePaid = (id: number) => {
    setLocalExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.paper,
        p: 2,
        borderRadius: "4px",
        boxShadow: theme.shadows[1],
        transition: theme.transitions.create(["transform", "box-shadow"], {
          duration: theme.transitions.duration.short,
        }),
        height: 300, // Fixed overall card height
      }}
    >
      <CardHeader title="Upcoming Expenses" />
      <Divider />
      <CardContent
        sx={{
          height: "calc(100% - 40px)", // Adjust this if your CardHeader+Divider have a different height
          overflowY: "auto",
        }}
      >
        <List>
          {localExpenses.map((expense) => (
            <ListItem
              key={expense.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={() => handleExpensePaid(expense.id)}
                />
              }
            >
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {expense.description}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption">
                    {`Due: ${new Date(expense.dueDate).toLocaleDateString()} — $${expense.amount.toFixed(2)}`}
                  </Typography>
                }
=======
  // Get today's date and the date 7 days from now
  const today = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  // Filter the expenses to only include those within the next 7 days
  const upcomingExpenses = localExpenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= today && expenseDate <= sevenDaysFromNow;
  });

  return (
    <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Expenses
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <List>
        {upcomingExpenses.length > 0 ? (
          upcomingExpenses.map((expense) => (
            <ListItem key={expense.name}>
              <ListItemText
                primary={expense.name}
                secondary={`Due: ${new Date(expense.date).toLocaleDateString()} — $${expense.cost.toFixed(2)}`}
>>>>>>> origin/NewEliBranch
              />
              {/* Optional: Add a checkbox or other actions here */}
              <Checkbox />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No upcoming expenses within the next 7 days." />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default UpcomingExpensesCard;
