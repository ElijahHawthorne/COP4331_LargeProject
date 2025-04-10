import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

interface AddDebtProps {
  userId: number | null;  // User ID, required to associate the debt and expense with the user
  onDebtAdded: () => void;  // Callback to update state or trigger a UI update after debt is added
}

const AddDebt: React.FC<AddDebtProps> = ({ userId, onDebtAdded }) => {
  const [debtName, setDebtName] = useState('');
  const [debtAmount, setDebtAmount] = useState<number | null>(null);  // Renamed to debtAmount
const [paymentDate, setPaymentDate] = useState(''); // Renamed to paymentDate
const [paymentProgress, setPaymentProgress] = useState<number | null>(null);  // Renamed to paymentProgress

  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDebtSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if userId is null
    if (userId === null) {
      setError('User is not logged in');
      return;
    }

    // Validate that the cost, payment amount, and progress are numbers
    const debtCostNum = debtAmount && !isNaN(debtAmount) ? Number(debtAmount) : 0;
    const paymentAmountNum = paymentAmount && !isNaN(paymentAmount) ? Number(paymentAmount) : 0;
    const progressNum = paymentProgress && !isNaN(paymentProgress) ? Number(paymentProgress) : 0;

    if (isNaN(debtCostNum) || isNaN(paymentAmountNum) || isNaN(progressNum)) {
      setError('Please enter valid numbers for cost, payment amount, and progress.');
      return;
    }

    const newDebt = {
        name: debtName,
        amount: debtAmount,  // Use debtAmount instead of debtCost
        paymentAmount: paymentAmount,
        progress: paymentProgress,  // Use paymentProgress instead of progress
        date: paymentDate,  // Use paym
    };

    // Log the debt data being sent to the server
    console.log('Debt data being sent:', {
      userId: userId,
      debtName: newDebt.name,
      debtCost: newDebt.amount,
      paymentAmount: newDebt.paymentAmount,
      debtDate: newDebt.date,
      progress: newDebt.progress,
    });

    // Send debt data to the server
    try {
      const debtResponse = await fetch('http://777finances.com:5000/api/adddebt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            debtName: newDebt.name,
            debtAmount: newDebt.amount,  // Use debtAmount here
            paymentAmount: newDebt.paymentAmount,
            paymentDate: newDebt.date,  // Use paymentDate here
            paymentProgress: newDebt.progress,  // Use paymentProgress here
        }),
      });

      const debtData = await debtResponse.json();

      if (debtData.success) {
        // After adding debt, add expense
        const expenseData = {
          userId,
          expenseName: newDebt.name,
          expenseCost: newDebt.paymentAmount,
          expenseDate: newDebt.date,
          expenseCategory: 'Debt',  // Category set to 'debt'
        };

        // Log the expense data being sent to the server
        console.log('Expense data being sent:', expenseData);

        const expenseResponse = await fetch('http://777finances.com:5000/api/addexpense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expenseData),
        });

        const expenseDataResponse = await expenseResponse.json();

        if (expenseDataResponse.success) {
          onDebtAdded();  // Trigger callback to update the UI
         
        } else {
          setError(`Failed to add expense: ${expenseDataResponse.error}`);
        }
      } else {
        setError(`Failed to add debt: ${debtData.error}`);
      }
    } catch (error) {
      console.error('Error submitting debt and expense:', error);
      setError('An error occurred while adding the debt and expense.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h6">Add a New Debt</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleDebtSubmit}>
        <TextField
          label="Debt Name"
          value={debtName}
          onChange={(e) => setDebtName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Debt Amount"
          type="number"
          value={debtAmount||''}
          onChange={(e) => setDebtAmount(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Payment Amount"
          type="number"
          value={paymentAmount||''}
          onChange={(e) => setPaymentAmount(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Target Date"
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Progress"
          type="number"
          value={paymentProgress||''}
          onChange={(e) => setPaymentProgress(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
          
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Add Debt
        </Button>
      </form>
    </Box>
  );
};

export default AddDebt;
