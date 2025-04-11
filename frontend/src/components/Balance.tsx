import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { Expense } from '../Types';

interface BalanceCardProps {
  expenses: Expense[];
  income: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ expenses, income }) => {
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.cost, 0);
  const remainingBalance = income - totalExpenses;

  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Card
        sx={{
          width: 250,
          border: 'none',
          textAlign: 'center',
          p: 2, // Additional padding
        }}
      >
        <CardContent>
          {/* Top label */}
          <Typography variant="subtitle1" color="theme.palette.text.primary" gutterBottom>
            Remaining Balance
          </Typography>

          {/* Main balance in the middle */}
          <Typography
            variant="h3"
            sx={{fontSize: "2.5rem", my: 1, color: (theme) => theme.palette.text.primary }}
          >
          ${remainingBalance}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BalanceCard;

// primary.main