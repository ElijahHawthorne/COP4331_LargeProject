import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Expense {
  id: number;
  description: string;
  amount: number;
  dueDate: string; // ISO date string
}

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
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UpcomingExpensesCard;
