import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';

interface AddDebtProps {
  userId: number | null; 
  onDebtAdded: () => void; 
}

const AddDebt: React.FC<AddDebtProps> = ({ userId, onDebtAdded }) => {
  const [debtName, setDebtName] = useState('');
  const [debtAmount, setDebtAmount] = useState<number | null>(null); 
const [paymentDate, setPaymentDate] = useState(''); 
const [paymentProgress, setPaymentProgress] = useState<number | null>(null); 

  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string>("");
  const [messageColor, setMessageColor] = useState<string>("");
  const { mode } = useColorScheme(); // 'light' | 'dark' | undefined
    const inputSx = {
      backgroundColor: mode === 'dark' ? 'hsl(219, 50%, 13%)' : '#fff',
      '& input': {
        backgroundColor: mode === 'dark' ? 'transparent' : '#fff',
        color: mode === 'dark' ? '#fff' : '#000',
      },
    };
  const handleDebtSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (userId === null) {
      setError('User is not logged in');
      return;
    }

    //Check that the cost, payment amount, and progress are numbers
    const debtCostNum = debtAmount && !isNaN(debtAmount) ? Number(debtAmount) : 0;
    const paymentAmountNum = paymentAmount && !isNaN(paymentAmount) ? Number(paymentAmount) : 0;
    const progressNum = paymentProgress && !isNaN(paymentProgress) ? Number(paymentProgress) : 0;

    if (isNaN(debtCostNum) || isNaN(paymentAmountNum) || isNaN(progressNum)) {
      setError('Please enter valid numbers for cost, payment amount, and progress.');
      return;
    }

    const newDebt = {
        name: debtName,
        amount: debtAmount,  
        paymentAmount: paymentAmount,
        progress: paymentProgress, 
        date: paymentDate, 
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
          debtAmount: newDebt.amount, 
          paymentAmount: newDebt.paymentAmount,
          paymentDate: newDebt.date,  
          paymentProgress: newDebt.progress, 
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
          expenseCategory: 'Debt',
          recurring: true  //Category set to debt
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
          setMessage('Debt added successfully!');
          setMessageColor("success");
          onDebtAdded();  //callback to update the UI
        } else {
          setError(`Failed to add expense: ${expenseDataResponse.error}`);
        }
      } else {
        setError(`Failed to add debt: ${debtData.error}`);
        setMessageColor("error");
      }
    } catch (error) {
      console.error('Error submitting debt and expense:', error);
      setError('An error occurred while adding the debt and expense.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 1, paddingTop: 0, overflowY: "auto" }}>
          <Typography
            variant="caption"
            sx={{ color: "gray", fontStyle: "italic", display: "block"}}
          >
            * = Required Field
          </Typography>
      
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleDebtSubmit}>
        <TextField
          label="Debt Name"
          value={debtName}
          onChange={(e) => setDebtName(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputProps={{
            sx: inputSx
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
          label="Debt Amount"
          type="number"
          value={debtAmount || ''}
          onChange={(e) => setDebtAmount(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
          InputProps={{
            sx: inputSx,
            inputProps: {
              style: { WebkitAppearance: "none", MozAppearance: "textfield" },
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
          value={paymentAmount || ''}
          onChange={(e) => setPaymentAmount(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
          InputProps={{
            sx: inputSx,
            inputProps: {
              style: { WebkitAppearance: "none", MozAppearance: "textfield" },
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
          label="Payment Date"
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
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
          InputProps={{
            sx: inputSx
          }}
        />
        <TextField
          label="Progress"
          type="number"
          value={paymentProgress || ''}
          onChange={(e) => setPaymentProgress(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
          InputProps={{
            sx: inputSx,
            inputProps: {
              style: { WebkitAppearance: "none", MozAppearance: "textfield" },
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Add Debt
        </Button>
      </form>
    </Box>
  );
};

export default AddDebt;
