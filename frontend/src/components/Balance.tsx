import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { Expense } from '../Types';

interface BalanceCardProps {
  expenses: Expense[];
  income: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ expenses, income }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based
  const currentYear = currentDate.getFullYear();

  const filteredExpenses = expenses.filter((expense) => {
    // Always include recurring expenses
    if (expense.recurring) return true;

    // For non-recurring expenses, check if they belong to the current month/year
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const totalExpenses = filteredExpenses.reduce(
    (acc, expense) => acc + expense.cost,
    0
  );

  const remainingBalance = (income - totalExpenses).toFixed(2);

  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Card
        sx={{
          width: 'max-content',
          border: 'none',
          textAlign: 'center',
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              fontSize: '3.5rem',
              my: 1,
              color: "primary",
            }}
          >
            ${remainingBalance}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BalanceCard;
