


import React from 'react';
import { Box, Typography, LinearProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Goal } from '../Types';  // Assuming your Goal type is defined

interface ViewGoalsProps {
  goals: Goal[];  // Array of goals to display
  userId: number | null;  // User ID is needed for deletion
  onGoalDeleted: (goalName: string) => void;  // Callback to update state after goal deletion
}

const ViewGoals: React.FC<ViewGoalsProps> = ({ goals = [], userId, onGoalDeleted }) => {
  const handleDeleteGoal = async (goalName: string) => {
    if (!userId) {
      alert('User is not logged in');
      return;
    }

    try {
      // First, delete the goal
      const goalResponse = await fetch('http://777finances.com:5000/api/removegoal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,  // Pass the userId
          goalName: goalName,  // Pass the goalName
        }),
      });

      const goalData = await goalResponse.json();

      if (goalData.success) {
        // After successful goal deletion, remove the goal from the state
        onGoalDeleted(goalName);  // Call onGoalDeleted to update the UI

        alert('Goal deleted successfully!');


        const expenseResponse = await fetch('http://777finances.com:5000/api/removeexpense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,  // Pass the userId
            expenseName: goalName,  // Pass the debtName, which will match the expense name
          }),
        });

        const expenseData = await expenseResponse.json();

        if (expenseData.success) {
          alert('Debt and related expense deleted successfully!');
        } else {
          alert(`Failed to delete related expense: ${expenseData.error}`);
        }




      } else {
        alert(`Failed to delete goal: ${goalData.error}`);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('An error occurred while deleting the goal.');
    }
  };

  return (
    <div>


      {/* Map through each goal and display it */}
      {goals.length > 0 ? (
        goals.map((goal, index) => (
          <Box
            key={goal.name+index}
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
              onClick={() => handleDeleteGoal(goal.name)}
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

            <Typography variant="h6">{goal.name}</Typography>
            <Typography variant="body1">Target Amount: ${goal.cost}</Typography>
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
