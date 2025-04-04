



import { Box, Typography, LinearProgress } from '@mui/material';
import { Goal } from '../Types';
// Define the Goal interface based on the new schema

interface ViewGoalsProps {
  goals: Goal[];  // Array of goals to display
}

const ViewGoals: React.FC<ViewGoalsProps> = ({ goals = [] }) => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Goals
      </Typography>

      {/* Map through each goal and display it */}
      {goals.length > 0 ? (
        goals.map((goal, index) => (
          <Box key={index} sx={{ mb: 3, padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h6">{goal.name}</Typography>
            <Typography variant="body1">Total Cost: ${goal.cost}</Typography>
            <Typography variant="body2">Payment Amount: ${goal.paymentAmount} per month</Typography>
            <Typography variant="body2">Progress: ${goal.progress}</Typography>
            <Typography variant="body2">Target Date: {goal.date}</Typography>

            {/* Calculate progress as a percentage */}
            <LinearProgress
              variant="determinate"
              value={(goal.progress / goal.cost) * 100}
              sx={{ marginTop: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
              <Typography variant="body2">{`$${goal.progress} of $${goal.cost}`}</Typography>
              <Typography variant="body2">{`${Math.round((goal.progress / goal.cost) * 100)}%`}</Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No goals to display</Typography>
      )}
    </div>
  );
};

export default ViewGoals;
