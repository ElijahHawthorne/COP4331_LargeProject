import React from 'react';
import { Box, Typography, LinearProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Debt } from '../Types';

interface ViewDebtProps {
  debt: Debt[];
  userId: number | null;
  onDebtDeleted: (debtName: string) => void;
}

const Viewdebt: React.FC<ViewDebtProps> = ({ debt = [], userId, onDebtDeleted }) => {
  const handleDeleteDebt = async (debtName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the debt "${debtName}" and its related expense?`);
    if (!confirmDelete) return; 
  
    try {
      const debtResponse = await fetch('http://777finances.com:5000/api/deletedebt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          debtName: debtName,
        }),
      });
  
      const debtData = await debtResponse.json();
  
      if (debtData.success) {
        onDebtDeleted(debtName);
  
        const expenseResponse = await fetch('http://777finances.com:5000/api/removeexpense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            expenseName: debtName,
          }),
        });
  
        const expenseData = await expenseResponse.json();
  
        if (expenseData.success) {
          console.log('Debt and related expense deleted successfully!');
        } else {
          console.log(`Failed to delete related expense: ${expenseData.error}`);
        }
      } else {
        console.log(`Failed to delete debt: ${debtData.error}`);
      }
    } catch (error) {
      console.error('Error deleting debt and expense:', error);
      console.log('An error occurred while deleting the debt and expense.');
    }
  };
  

  function formatDateToMDY(dateStr: string): string {
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  }

  return (
    <div>
      {debt.length > 0 ? (
        debt.map((debtItem, index) => (
          <Box
            key={debtItem.name+index}
            sx={{
              mb: 3,
              padding: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
              position: 'relative',
              "&:hover .action-buttons": {
                opacity: 1,
              },
            }}
          >
            <IconButton
              onClick={(e) =>{e.stopPropagation(); handleDeleteDebt(debtItem.name)}}
              className="action-buttons"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                size: 'small',
                fontSize: '15px',
                opacity:0,
                transition: "opacity 0.3s",
                color: 'gray',
                '&:hover': {
                  color: 'red',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>

            <Typography variant="h6">{debtItem.name}</Typography>
            <Typography variant="body1">Total Cost: ${debtItem.amount}</Typography>
            <Typography variant="body2">Payment Amount: ${debtItem.paymentAmount} per month</Typography>
            <Typography variant="body2">Progress: ${debtItem.progress}</Typography>
            <Typography variant="body2">Payment Date: {formatDateToMDY(debtItem.date)}</Typography>

            {/*Calculate progress as a percentage*/}
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
        <Typography
        sx={{
          textAlign: "center",
          color: "primary",
          mt: 4,
          fontSize: "1.2rem",
        }}>No debt to display</Typography>
      )}
    </div>
  );
};

export default Viewdebt;