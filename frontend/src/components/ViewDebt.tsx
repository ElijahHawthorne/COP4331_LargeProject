import React from 'react';
import { Box, Typography, LinearProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Debt } from '../Types';

interface ViewDebtProps {
  debt: Debt[];  // Array of debt to display
  userId: number | null;  // User ID is needed for the deletion
  onDebtDeleted: (debtName: string) => void;  // Callback to update state after deletion
}

const Viewdebt: React.FC<ViewDebtProps> = ({ debt = [], userId, onDebtDeleted }) => {
  const handleDeleteDebt = async (debtName: string) => {
    try {
      // First, delete the debt
      const debtResponse = await fetch('http://777finances.com:5000/api/deletedebt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,  // Pass the userId
          debtName: debtName,  // Pass the debtName
        }),
      });

      const debtData = await debtResponse.json();

      if (debtData.success) {
        // After successful debt deletion, remove the debt from the state
        onDebtDeleted(debtName);  // Call onDebtDeleted to update the UI

        // Now, remove the expense with the same name
        const expenseResponse = await fetch('http://777finances.com:5000/api/removeexpense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,  // Pass the userId
            expenseName: debtName,  // Pass the debtName, which will match the expense name
          }),
        });

        const expenseData = await expenseResponse.json();

        if (expenseData.success) {
          alert('Debt and related expense deleted successfully!');
        } else {
          alert(`Failed to delete related expense: ${expenseData.error}`);
        }
      } else {
        alert(`Failed to delete debt: ${debtData.error}`);
      }
    } catch (error) {
      console.error('Error deleting debt and expense:', error);
      alert('An error occurred while deleting the debt and expense.');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Debt
      </Typography>

      {/* Map through each debt and display it */}
      {debt.length > 0 ? (
        debt.map((debtItem, index) => (
          <Box
            key={debtItem.name+index}
            sx={{
              mb: 3,
              padding: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
              position: 'relative', // Make sure the delete button is positioned correctly
            }}
          >
            {/* Delete Icon Button at the top right */}
            <IconButton
              onClick={() => handleDeleteDebt(debtItem.name)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                size: 'small',
                fontSize: '15px',
                color: 'gray',
                '&:hover': {
                  color: 'red', // Change color when hovered over
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>

            <Typography variant="h6">{debtItem.name}</Typography>
            <Typography variant="body1">Total Cost: ${debtItem.amount}</Typography>
            <Typography variant="body2">Payment Amount: ${debtItem.paymentAmount} per month</Typography>
            <Typography variant="body2">Progress: ${debtItem.progress}</Typography>
            <Typography variant="body2">Target Date: {debtItem.date}</Typography>

            {/* Calculate progress as a percentage */}
            <LinearProgress
              variant="determinate"
              value={(debtItem.progress / debtItem.amount) * 100}
              sx={{ marginTop: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
              <Typography variant="body2">{`$${debtItem.progress} of $${debtItem.amount}`}</Typography>
              <Typography variant="body2">{`${Math.round((debtItem.progress / debtItem.amount) * 100)}%`}</Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No debt to display</Typography>
      )}
    </div>
  );
};

export default Viewdebt;
