// src/components/UpcomingExpensesCard.tsx
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
} from "@mui/material";

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
  // Local state to track current expenses
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(expenses);

  // Update local state when props change
  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

  // When an expense is marked as paid, remove it from the list.
  // You could also add an animation or strike-through effect here.
  const handleExpensePaid = (id: number) => {
    setLocalExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return (
    <Card>
      <CardHeader title="Upcoming Expenses" />
      <Divider />
      <CardContent>
        <List>
          {localExpenses.map((expense) => (
            <ListItem
              key={expense.id}
              // Secondary action places the Checkbox on the right; 
              // to move it to the left, you can restructure the ListItem
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={() => handleExpensePaid(expense.id)}
                />
              }
            >
              <ListItemText
                primary={expense.description}
                secondary={`Due: ${new Date(expense.dueDate).toLocaleDateString()} — $${expense.amount.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UpcomingExpensesCard;
