import { Box, Typography, LinearProgress } from '@mui/material';
import { Debt } from '../Types';
// Define the debt interface based on the new schema

interface ViewDebtProps {
  debt: Debt[];  // Array of debt to display
}

const Viewdebt: React.FC<ViewDebtProps> = ({ debt = [] }) => {
    
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Debt
      </Typography>

      {/* Map through each debt and display it */}
      {debt.length > 0 ? (
        debt.map((debt, index) => (
          <Box key={index} sx={{ mb: 3, padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h6">{debt.name}</Typography>
            <Typography variant="body1">Total Cost: ${debt.cost}</Typography>
            <Typography variant="body2">Payment Amount: ${debt.paymentAmount} per month</Typography>
            <Typography variant="body2">Progress: ${debt.progress}</Typography>
            <Typography variant="body2">Target Date: {debt.date}</Typography>

            {/* Calculate progress as a percentage */}
            <LinearProgress
              variant="determinate"
              value={(debt.progress / debt.cost) * 100}
              sx={{ marginTop: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
              <Typography variant="body2">{`$${debt.progress} of $${debt.cost}`}</Typography>
              <Typography variant="body2">{`${Math.round((debt.progress / debt.cost) * 100)}%`}</Typography>
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
