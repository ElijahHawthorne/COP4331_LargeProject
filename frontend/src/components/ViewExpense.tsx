import React from "react";
import { Expense } from "../Types";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

interface ViewExpenseProps {
  expenseList?: Expense[]; // Make the prop optional
  onEdit?: (expense: Expense) => void; // Callback for editing an expense
  onDelete?: (expense: Expense) => void; // Callback for deleting an expense
}

function formatDateToMDY(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${month}-${day}-${year}`;
}

const ViewExpense: React.FC<ViewExpenseProps> = ({
  expenseList = [],
  onDelete,
}) => {
  return (
    <Box>
      {expenseList.length > 0 ? (
        expenseList.map((expense, index) => (
          <Box
            key={index}
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
            <Box display={"flex"} alignItems="center" gap={1}>
            <Typography variant="h6">{expense.name}</Typography>
            {expense.recurring&&(<ChangeCircleIcon fontSize="small"/>)}
            </Box>
            <Typography variant="body1">Cost: ${expense.cost}</Typography>
            <Typography variant="body2">
              Category: {expense.category || "N/A"}
            </Typography>
            <Typography variant="body2">
              Date: {formatDateToMDY(expense.date) || "N/A"}
            </Typography>

            {/* Action Buttons */}
            <Box
              className="action-buttons"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 1,
                opacity: 0,
                transition: "opacity 0.3s",
              }}
            >
              <IconButton
                size="small"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  const confirmDelete = window.confirm(
                    `Are you sure you want to delete the expense "${expense.name}"?`
                  );
                  if (confirmDelete && onDelete) {
                    onDelete(expense);
                  }
                }}
                sx={{
                  color: "gray",
                  "&:hover": {
                    color: "red",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
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
        }}>No expenses to display</Typography>
      )}
    </Box>
  );
};

export default ViewExpense;
