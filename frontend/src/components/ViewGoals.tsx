import React from "react";
import { Box, Typography, LinearProgress, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Goal } from "../Types"; 
interface ViewGoalsProps {
  goals: Goal[]; 
  userId: number | null;
  onGoalDeleted: (goalName: string) => void;
}

const ViewGoals: React.FC<ViewGoalsProps> = ({
  goals = [],
  userId,
  onGoalDeleted,
}) => {
  const handleDeleteGoal = async (goalName: string) => {
    if (!userId) {
      console.log("User is not logged in");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the goal "${goalName}" and its related expense?`
    );
    if (!confirmDelete) return;

    try {
      const goalResponse = await fetch(
        "http://777finances.com:5000/api/removegoal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            goalName: goalName,
          }),
        }
      );

      const goalData = await goalResponse.json();

      if (goalData.success) {
        onGoalDeleted(goalName);
        console.log("Goal deleted successfully!");

        const expenseResponse = await fetch(
          "http://777finances.com:5000/api/removeexpense",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              expenseName: goalName,
            }),
          }
        );

        const expenseData = await expenseResponse.json();

        if (expenseData.success) {
          console.log("Related expense deleted successfully!");
        } else {
          console.log(`Failed to delete related expense: ${expenseData.error}`);
        }
      } else {
        console.log(`Failed to delete goal: ${goalData.error}`);
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      console.log("An error occurred while deleting the goal.");
    }
  };
  function formatDateToMDY(dateStr: string): string {
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  }

  return (
    <div>
      {goals.length > 0 ? (
        goals.map((goal, index) => (
          <Box
            key={goal.name + index}
            sx={{
              mb: 3,
              padding: 2,
              border: "1px solid #ddd",
              borderRadius: 2,
              position: "relative",
              "&:hover .action-buttons": {
                opacity: 1,
              },
            }}
          >
            <IconButton
            className="action-buttons"
              onClick={(e) => {e.stopPropagation(); handleDeleteGoal(goal.name)}}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                size: 'small',
                fontSize: '15px',
                opacity: 0,
                transition: "opacity 0.3s",
                color: 'gray',
                '&:hover': {
                  color: 'red',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>

            <Typography variant="h6">{goal.name}</Typography>
            <Typography variant="body1">Target Amount: ${goal.cost}</Typography>
            <Typography variant="body2">Progress: ${goal.progress}</Typography>
            <Typography variant="body2">
              Payment Date: {formatDateToMDY(goal.date)}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={(goal.progress / goal.cost) * 100}
              sx={{ marginTop: 2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 1,
              }}
            >
              <Typography variant="body2">{`$${goal.progress} of $${goal.cost}`}</Typography>
              <Typography variant="body2">{`${Math.round(
                (goal.progress / goal.cost) * 100
              )}%`}</Typography>
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
        }}
        >No goals to display</Typography>
      )}
    </div>
  );
};

export default ViewGoals;