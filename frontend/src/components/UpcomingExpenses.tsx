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
  const theme = useTheme();
  // Local state to track current expenses
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(expenses);

  // Update local state when props change
  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

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
