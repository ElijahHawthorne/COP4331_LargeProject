import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, parseISO } from "date-fns";
import { Expense } from "../Types";
import { Typography, Box, Paper } from "@mui/material";

interface SpendingOverTimeProps {
  expenses: Expense[];
}

const SpendingOverTime: React.FC<SpendingOverTimeProps> = ({ expenses }) => {
  // Get current month interval.
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  // Generate all days of current month.
  const daysOfMonth = eachDayOfInterval({ start, end });

  // Create data for each day with total spending.
  const data = daysOfMonth.map((day) => {
    const total = expenses
      .filter((expense) => isSameDay(parseISO(expense.date), day))
      .reduce((sum, e) => sum + e.cost, 0);
    return {
      date: format(day, "MMM d"), // e.g., "Apr 10"
      amount: total,
    };
  });

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer", // Change cursor to pointer on hover
        transition: "box-shadow 0.3s ease, color 0.3s ease",
        "&:hover": {
          // Change shadow color based on mode.
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 4px 16px #2c4f83"
              : "0px 4px 16px #007FFF",
        },
      })}
    >
      <Typography variant="h6" gutterBottom>
        Expense Distribution by Category
      </Typography>
      <Box sx={{ width: 650, height: 300 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} interval={0} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SpendingOverTime;
