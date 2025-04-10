import { Expense } from "../Types";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ViewExpenseProps {
  expenseList?: Expense[]; // Make the prop optional
  onEdit?: (expense: Expense) => void; // Callback for editing an expense
  onDelete?: (expense: Expense) => void; // Callback for deleting an expense
}

const ViewExpense: React.FC<ViewExpenseProps> = ({
  expenseList = [],
  onEdit,
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
            <Typography variant="h6">{expense.name}</Typography>
            <Typography variant="body1">Cost: ${expense.cost}</Typography>
            <Typography variant="body2">Category: {expense.category || "N/A"}</Typography>
            <Typography variant="body2">Date: {expense.date || "N/A"}</Typography>

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
                color="primary"
                onClick={() => onEdit && onEdit(expense)} // Trigger the onEdit callback
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="secondary"
                onClick={() => onDelete && onDelete(expense)} // Trigger the onDelete callback
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No expenses to display</Typography>
      )}
    </Box>
  );
};

export default ViewExpense;