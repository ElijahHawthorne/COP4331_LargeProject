import React from 'react';
import { Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { Expense } from '../Types'; // Assuming the Expense interface is imported

interface BalanceCardProps {
  expenses: Expense[];  // Array of expenses
  income: number;       // Income value
}

const BalanceCard: React.FC<BalanceCardProps> = ({ expenses, income }) => {
  // Calculate the total cost of all expenses
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.cost, 0);
  
  // Calculate the remaining balance
  const remainingBalance = income - totalExpenses;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <Card sx={{ width: 350, boxShadow: 3 }}>
        <CardContent>
          
          <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
            Remaining Balance: ${remainingBalance}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BalanceCard;